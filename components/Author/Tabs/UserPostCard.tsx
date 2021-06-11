import AuthorAvatar from "../../AuthorAvatar";
import DesktopOnly from "../../DesktopOnly";
import Link from "next/link";
import MobileOnly from "../../MobileOnly";
import React, { Fragment, SyntheticEvent, useState } from "react";
import ResponsvePostVoteWidget from "./ResponsivePostVoteWidget";
import Ripples from "react-ripples";
import colors from "../../../config/themes/colors";
import { css, StyleSheet } from "aphrodite";
import {
  UPVOTE,
  DOWNVOTE,
  UPVOTE_ENUM,
  DOWNVOTE_ENUM,
} from "../../../config/constants";
import { connect } from "react-redux";
import DiscussionActions from "../../../redux/discussion";
import API from "../../../config/api";
// import { handleCatch } from "../../../config/utils";

export type UserPostCardProps = {
  created_by: any;
  postUpvotePending: Function;
  postUpvote: Function;
  postDownvotePending: Function;
  postDownvote: Function;
  preview_img: string;
  renderable_text: string;
  style: StyleSheet;
  title: string;
  unified_document_id;
};

function UserPostCard(props: UserPostCardProps) {
  const {
    unified_document_id: unifiedDocumentId,
    created_by: {
      author_profile: { first_name, last_name },
    },
    created_by: { author_profile: author },
    postUpvotePending,
    postUpvote,
    postDownvotePending,
    postDownvote,
    preview_img: previewImg,
    renderable_text: renderableText,
    style,
    title,
  } = props;

  const [voteState, setVoteState] = useState<string | null>(
    null /* TODO: briansantoso - get user's vote on post */
  );
  const [score, setScore] = useState<number>(
    0 /* TODO: briansantoso - get post vote count*/
  );

  const creatorName = first_name + " " + last_name;
  const slug = title.toLowerCase().replace(/\s/g, "-");

  const mainTitle = (
    <a
      className={css(styles.link)}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <span className={css(styles.title)}>{title}</span>
    </a>
  );

  let previewImgComponent;
  if (previewImg) {
    previewImgComponent = (
      <div
        className={css(styles.column, styles.previewColumn)}
        onClick={(e) => {
          e.stopPropagation();
        }}
      >
        <div className={css(styles.preview)}>
          <img src={previewImg} className={css(styles.image)} />
        </div>
      </div>
    );
  } else {
    previewImgComponent = (
      <div className={css(styles.column, styles.previewColumn)}>
        <div className={css(styles.preview, styles.previewEmpty)} />
      </div>
    );
  }

  const creatorTag = (
    <div className={css(styles.postCreatedBy)}>
      <AuthorAvatar author={author} size={28} border="2px solid #F1F1F1" />
      <span className={css(styles.creatorName)}>{creatorName}</span>
    </div>
  );

  const summary = (
    <div className={css(styles.summary) + " clamp2"}>{renderableText}</div>
  );

  // TODO: briansantoso - integrate with backend when ready
  const createVoteHandler = (voteType) => {
    // TODO: briansantoso - does voting require redux?
    const voteStrategies = {
      [UPVOTE]: {
        increment: 1,
        handlePending: postUpvotePending,
        handleVote: async (postId) => {
          const response = await fetch(
            API.RH_POST_UPVOTE(postId),
            API.POST_CONFIG()
          ).catch((err) => console.log(err));

          console.log(response);
          return response;
        },
      },
      [DOWNVOTE]: {
        increment: -1,
        handlePending: postDownvotePending,
        handleVote: postDownvote,
      },
    };

    const { increment, handlePending, handleVote } = voteStrategies[voteType];

    return async (e: SyntheticEvent) => {
      e.stopPropagation();

      // TODO: briansantoso - does voting require redux?

      // handlePending();
      // await handleVote(paperId, discussionThreadId, commentId);
      // await handleVote(unifiedDocumentId);

      if (voteState === voteType) {
        /**
         * Deselect
         * NOTE: This will never be called with the current implementation of
         * VoteWidget, because it disables the onVote/onDownvote callback
         * if the button is already selected.
         */
        setVoteState(null);
        setScore(score - increment); // Undo the vote
      } else {
        setVoteState(voteType);
        if (voteState === UPVOTE || voteState === DOWNVOTE) {
          // If post was already upvoted / downvoted by user, then voting
          // oppoistely will reverse the score by twice as much
          setScore(score + increment * 2);
        } else {
          // User has not voted, so regular vote
          setScore(score + increment);
        }
      }
    };
  };

  const desktopVoteWidget = (
    <ResponsvePostVoteWidget
      onDesktop
      onDownvote={createVoteHandler(DOWNVOTE)}
      onUpvote={createVoteHandler(UPVOTE)}
      score={score}
      voteState={voteState}
    />
  );

  const mobileVoteWidget = (
    <ResponsvePostVoteWidget
      onDesktop={false}
      onDownvote={createVoteHandler(DOWNVOTE)}
      onUpvote={createVoteHandler(UPVOTE)}
      score={score}
      voteState={voteState}
    />
  );
  const mobileCreatorTag = <MobileOnly> {creatorTag} </MobileOnly>;

  return (
    <Ripples className={css(styles.userPostCard, style && style)}>
      {desktopVoteWidget}
      <Link
        href={{
          pathname: "/post/[documentId]/[title]",
          query: {
            documentId: `${unifiedDocumentId}`,
            title: `${slug}`,
          },
        }}
        as={`/post/${unifiedDocumentId}/${slug}`}
      >
        <div className={css(styles.container)}>
          <div className={css(styles.rowContainer)}>
            <div className={css(styles.column, styles.metaData)}>
              <div className={css(styles.topRow)}>
                {mobileVoteWidget}
                <DesktopOnly> {mainTitle} </DesktopOnly>
              </div>
              <MobileOnly> {mainTitle} </MobileOnly>
              {summary}
              {mobileCreatorTag}
            </div>
            <DesktopOnly> {previewImgComponent} </DesktopOnly>
          </div>
          <div className={css(styles.bottomBar)}>
            <div className={css(styles.rowContainer)}>
              <DesktopOnly> {creatorTag} </DesktopOnly>
            </div>
            <DesktopOnly>
              <div className={css(styles.row)}>
                {/* TODO: briansantoso - Hub tags go here */}
              </div>
            </DesktopOnly>
          </div>
          <MobileOnly>
            <div className={css(styles.bottomBar, styles.mobileHubTags)}>
              {/* TODO: briansantoso - Hub tags go here */}
            </div>
          </MobileOnly>
        </div>
      </Link>
    </Ripples>
  );
}

const mapStateToProps = (state) => ({
  // discussion: state.discussion,
  // vote: state.vote,
  // auth: state.auth,
});

const mapDispatchToProps = {
  postUpvotePending: DiscussionActions.postUpvotePending,
  postUpvote: DiscussionActions.postUpvote,
  postDownvotePending: DiscussionActions.postDownvotePending,
  postDownvote: DiscussionActions.postDownvote,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserPostCard);

/**
 * Styles taken from PaperEntryCard.js
 * If style does not appear correct, check if Paper Entry Cards
 * are behaving the same way. If not, refer to PaperEntryCard.js styles
 */
const styles = StyleSheet.create({
  userPostCard: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    padding: 15,
    boxSizing: "border-box",
    backgroundColor: "#FFF",
    cursor: "pointer",
    border: "1px solid #EDEDED",
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 3,
    overflow: "hidden",
    ":hover": {
      backgroundColor: "#FAFAFA",
    },
  },
  postCreatedBy: {
    display: "flex",
    alignItems: "center",
    "@media only screen and (max-width: 767px)": {
      marginTop: 8,
    },
  },
  postContent: {},
  creatorName: {
    fontSize: 18,
    fontWeight: 400,
    marginLeft: 8,
    "@media only screen and (max-width: 767px)": {
      fontSize: 16,
    },
  },
  image: {
    objectFit: "contain",
    maxHeight: 90,
    height: 90,
  },
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    height: "100%",
    width: "100%",
    boxSizing: "border-box",
  },
  rowContainer: {
    display: "flex",
    alignItems: "flex-start",
    width: "100%",
  },
  column: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    height: "100%",
    position: "relative",
  },
  metaData: {
    height: "100%",
    width: "100%",
    boxSizing: "border-box",
    justifyContent: "space-between",
    marginRight: "8px",
  },
  topRow: {
    display: "flex",
    alignItems: "center",
    width: "100%",
    paddingBottom: 8,
    "@media only screen and (max-width: 767px)": {
      justifyContent: "space-between",
      paddingBottom: 10,
    },
  },
  bottomBar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  mobileHubTags: {
    display: "none",
    "@media only screen and (max-width: 767px)": {
      display: "flex",
      width: "100%",
      justifyContent: "flex-end",
      marginTop: 0,
    },
  },
  link: {
    textDecoration: "none",
    color: "inherit",
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    width: "100%",
  },
  title: {
    width: "100%",
    fontSize: 20,
    fontWeight: 500,
    color: colors.BLACK(),
    "@media only screen and (max-width: 767px)": {
      fontSize: 16,
      paddingBottom: 10,
    },
  },
  preview: {
    height: 90,
    maxHeight: 90,
    width: 80,
    minWidth: 80,
    maxWidth: 80,
    boxSizing: "border-box",
    backgroundColor: "#FFF",
    border: "1px solid rgba(36, 31, 58, 0.1)",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  previewEmpty: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    border: "unset",
    backgroundColor: "unset",
    height: "unset",
    maxHeight: "unset",
    width: "unset",
    minWidth: "unset",
    maxWidth: "unset",
  },
  previewColumn: {
    "@media only screen and (max-width: 767px)": {
      justifyContent: "center",
      alignItems: "center",
      width: "100%",
    },
  },
  summary: {
    width: "100%",
    minWidth: "100%",
    maxWidth: "100%",
    color: colors.BLACK(0.8),
    fontSize: 14,
    lineHeight: 1.3,
    marginTop: 5,
    "@media only screen and (max-width: 767px)": {
      fontSize: 13,
    },
  },
  row: {
    display: "flex",
    alignItems: "center",
    "@media only screen and (max-width: 767px)": {
      flexDirection: "column",
      height: "unset",
      alignItems: "flex-start",
    },
  },
});
