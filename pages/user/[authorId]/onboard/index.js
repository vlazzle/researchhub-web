import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, css } from "aphrodite";
import { connect } from "react-redux";
import ReactPlaceholder from "react-placeholder/lib";
import "react-placeholder/lib/reactPlaceholder.css";
import Router from "next/router";

import OnboardPlaceholder from "~/components/Placeholders/OnboardPlaceholder";
import OnboardForm from "~/components/Onboard/OnboardForm";
import OnboardHubList from "~/components/Onboard/OnboardHubList";
import ButtonsRow from "~/components/Form/ButtonsRow";

import { ModalActions } from "~/redux/modals";
import { HubActions } from "~/redux/hub";

import { subscribeToHub } from "~/config/fetch";

const Index = (props) => {
  const [page, setPage] = useState(1);
  const [saving, toggleSaving] = useState(false);
  const [userHubs, setUserHubs] = useState([]);

  let formRef = useRef();

  const formatStep = () => {
    switch (page) {
      case 1:
        return "Step 1: Select the hubs you want to subscribe";
      case 2:
        return "Step 2: User Information";
      default:
        return;
    }
  };

  const formatTitle = () => {
    switch (page) {
      case 1:
        return "Select Hubs";
      case 2:
        return "Enter your profile information";
      default:
        return;
    }
  };

  const formatButtons = () => {
    switch (page) {
      case 1:
        return {
          left: {
            label: "Skip",
            onClick: () => setPage(page + 1),
          },
          right: {
            label: "Next Step",
            onClick: saveHubPreferences,
            disabled: saving,
          },
        };
      case 2:
        return {
          left: {
            label: "Previous Step",
            onClick: () => setPage(page - 1),
          },
          right: {
            label: "Save",
            onClick: saveUserInformation,
          },
        };
    }
  };

  /**
   * Handle user's click of hub on onboarding screen
   * @param {Object} hub metadata of hub being clicked.
   * @param {Boolean} state whether the hub is being add or removed.
   */
  const handleHubClick = (hub, state) => {
    let updatedUserHubs;

    if (state) {
      updatedUserHubs = [...userHubs, hub];
    } else {
      updatedUserHubs = userHubs.filter((el) => el.id !== hub.id);
    }

    return setUserHubs(updatedUserHubs);
  };

  /**
   * Saves user's hub selections and updates client's state
   */
  const saveHubPreferences = () => {
    toggleSaving(true);

    for (let i = 0; i < userHubs.length; i++) {
      // hit backend
      subscribeToHub(userHubs[i].id);
    }
    props.updateSubscribedHubs(userHubs); // update client
    toggleSaving(false);
    setPage(page + 1);
  };

  const saveUserInformation = () => {
    const saveButton = formRef.current.buttonRef.current;
    saveButton.click();
  };

  const connectOrcidAccount = () => {
    props.openOrcidConnectModal(true);
  };

  const navigateToProfile = () => {
    Router.push("/", `/`).then(() => {
      connectOrcidAccount();
    });
  };

  const renderPage = () => {
    switch (page) {
      case 1:
        return (
          <ReactPlaceholder
            ready={props.hubs.topHubs.length}
            showLoadingAnimation
            customPlaceholder={<OnboardPlaceholder color="#efefef" />}
          >
            <OnboardHubList
              hubs={props.hubs.topHubs.slice(0, 9)}
              onClick={handleHubClick}
            />
          </ReactPlaceholder>
        );
      case 2:
        return (
          <OnboardForm
            forwardedRef={formRef}
            onAuthorSave={navigateToProfile}
          />
        );
    }
  };

  return (
    <div className={css(styles.root)}>
      <div className={css(styles.titleContainer)}>
        <h1 className={css(styles.title)}>Onboarding</h1>
        <h3 className={css(styles.subtitle)}>{formatStep()}</h3>
      </div>
      <div className={css(styles.pageContainer)}>
        <h1 className={css(styles.pageTitle)}>{formatTitle()}</h1>
        <div className={css(styles.pageContent)}>{renderPage()}</div>
      </div>
      <div className={css(styles.buttonRowContainer)}>
        <ButtonsRow {...formatButtons()} />
      </div>
    </div>
  );
};

Index.getInitialProps = async ({ query, res }) => {
  if (!query.internal && res.writeHead) {
    res.writeHead(302, { Location: `/user/${query.authorId}/contributions` });
    res.end();

    return { authorId: query.authorId, redirect: true };
  }

  return { authorId: query.authorId };
};

const styles = StyleSheet.create({
  root: {
    backgroundColor: "#FCFCFC",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "center",
    scrollBehavior: "smooth",
    position: "relative",
    minHeight: "100vh",
  },
  title: {
    padding: 0,
    margin: 0,
    fontWeight: 500,
    fontSize: 28,
    color: "#232038",
    "@media only screen and (max-width: 665px)": {
      fontSize: 25,
    },
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 400,
    color: "#6f6c7d",
    padding: 0,
    margin: 0,
    marginTop: 10,
    "@media only screen and (max-width: 665px)": {
      width: 300,
      textAlign: "center",
    },
  },
  titleContainer: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
    marginTop: 60,
    marginBottom: 40,
  },
  form: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  pageContainer: {
    position: "relative",
    backgroundColor: "#FFF",
    border: "1px solid #ddd",
    borderRadius: 4,
    padding: "30px 60px",
    "@media only screen and (max-width: 935px)": {
      minWidth: "unset",
      width: 600,
      padding: 40,
      marginTop: 16,
    },
    "@media only screen and (max-width: 665px)": {
      width: "calc(100% - 16px)",
      padding: 16,
    },
    "@media only screen and (max-width: 415px)": {
      borderTop: "unset",
    },
  },
  pageTitle: {
    padding: 0,
    margin: 0,
    paddingBottom: 10,
    fontWeight: 400,
    marginBottom: 40,
    borderBottom: "1px solid #DDD",
    fontSize: 22,
  },
  // BUTTON
  buttonRowContainer: {
    marginTop: 40,
    width: "100%",
    "@media only screen and (max-width: 935px)": {
      marginBottom: 30,
    },
  },
});

const mapStateToProps = (state) => ({
  hubs: state.hubs,
  auth: state.auth,
  author: state.auth.user.author_profile,
  user: state.auth.user,
});

const mapDispatchToProps = {
  openOrcidConnectModal: ModalActions.openOrcidConnectModal,
  updateSubscribedHubs: HubActions.updateSubscribedHubs,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Index);
