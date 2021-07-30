import API from "~/config/api";
import PaperPlaceholder from "../../Placeholders/PaperPlaceholder";
import React, { useEffect, useState } from "react";
import ReactPlaceholder from "react-placeholder";
import UserPostCard from "./UserPostCard";
import EmptyState from "./EmptyState";
import icons from "~/config/themes/icons";
import colors from "~/config/themes/colors";
import { Helpers } from "@quantfive/js-web-config";
import { connect, useStore, useDispatch } from "react-redux";
import { css, StyleSheet } from "aphrodite";
import { isNullOrUndefined } from "~/config/utils/nullchecks";
import { AuthorActions } from "~/redux/author";

function useEffectFetchUserPosts({
  setIsFetching,
  setPosts,
  userID,
  store,
  dispatch,
}) {
  useEffect(() => {
    if (!isNullOrUndefined(userID)) {
      setIsFetching(true);
      fetch(API.RESEARCHHUB_POSTS({ created_by: userID }), API.GET_CONFIG())
        .then(Helpers.checkStatus)
        .then(Helpers.parseJSON)
        .then(async (data) => {
          try {
            setPosts(data.results);
            setIsFetching(false);

            await dispatch(
              AuthorActions.updateAuthorByKey({
                key: "posts",
                value: data,
                prevState: store.getState().author,
              })
            );
          } catch (error) {
            setIsFetching(false);
          }
        })
        .catch(() => {
          setIsFetching(false);
        });
    } else {
      setIsFetching(false);
    }
  }, [userID]);
}

function UserPosts(props) {
  const { author, user, fetching } = props;
  const [isFetching, setIsFetching] = useState(fetching);
  const [posts, setPosts] = useState([]);
  const store = useStore();
  const dispatch = useDispatch();

  let postCards;
  if (posts.length > 0) {
    postCards = posts.map((post, index) => (
      <UserPostCard
        {...post}
        key={post.id || index}
        style={styles.customUserPostCard}
      />
    ));
  } else {
    postCards = (
      <EmptyState
        message={"User has not created any posts"}
        icon={icons.comments}
      />
    );
  }

  useEffectFetchUserPosts({
    setIsFetching,
    setPosts,
    userID: author.user,
    store,
    dispatch,
  });
  return (
    <ReactPlaceholder
      ready={!isFetching}
      showLoadingAnimation
      customPlaceholder={<PaperPlaceholder color="#efefef" />}
    >
      {postCards}
    </ReactPlaceholder>
  );
}

const styles = StyleSheet.create({
  customUserPostCard: {
    border: 0,
    borderBottom: "1px solid rgba(36, 31, 58, 0.08)",
    marginBottom: 0,
    marginTop: 0,
    paddingTop: 24,
    paddingBottom: 24,
    ":last-child": {
      borderBottom: 0,
    },
  },
});

const mapStateToProps = (state) => ({
  user: state.auth.user,
  author: state.author,
});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserPosts);
