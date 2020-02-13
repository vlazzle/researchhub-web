import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";
import Link from "next/link";
import Router from "next/router";
import { connect } from "react-redux";
import Ripples from "react-ripples";

// Config
import colors from "../../config/themes/colors";
import API from "../../config/api";
import { Helpers } from "@quantfive/js-web-config";

// Redux
import { HubActions } from "~/redux/hub";

const DEFAULT_TRANSITION_TIME = 400;

class HubsList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hubs: [],
      reveal: false,
    };
  }

  componentDidMount() {
    if (this.props.hubs) {
      this.setState({ hubs: this.props.hubs }, () => {
        setTimeout(() => this.setState({ reveal: true }), 400);
      });
    } else {
      this.fetchHubs();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.exclude !== this.props.exclude) {
      this.setState(
        {
          reveal: false,
          hubs: this.props.hubs,
        },
        () => {
          setTimeout(() => this.setState({ reveal: true }), 400);
        }
      );
    }
    if (prevProps.hubs !== this.props.hubs) {
      this.setState({ hubs: this.props.hubs }, () => {
        setTimeout(() => this.setState({ reveal: true }), 400);
      });
    }
  }

  componentWillUnmount() {
    this.setState({ reveal: false });
  }

  fetchHubs = async () => {
    if (!this.props.hubs.length > 0) {
      await this.props.getHubs();
    }
    this.setState({ hubs: this.props.hubs }, () => {
      this.revealTransition();
    });
  };

  revealTransition = () => {
    setTimeout(() => this.setState({ reveal: true }), DEFAULT_TRANSITION_TIME);
  };

  renderHubEntry = () => {
    let selectedHubs =
      this.state.hubs.length > 9
        ? this.state.hubs.slice(0, 9)
        : this.state.hubs;
    return selectedHubs.map((hub, i) => {
      let { name, id, user_is_subscribed } = hub;
      return (
        <Fragment key={`${id}-${i}`}>
          {/* <Ripples onClick={() => this.handleClick(hub)}> */}
          <div
            key={`${id}-${i}`}
            className={css(styles.hubEntry)}
            onClick={() => this.handleClick(hub)}
          >
            {name}
            {user_is_subscribed && (
              <span className={css(styles.subscribedIcon)}>
                <i className="fas fa-star" />
              </span>
            )}
          </div>
          {/* // </Ripples> */}
          <div className={css(styles.space)} />
        </Fragment>
      );
    });
  };

  handleClick = (hub) => {
    function nameToUrl(name) {
      let arr = name.split(" ");
      return arr.length > 1 ? arr.join("-").toLowerCase() : name.toLowerCase();
    }

    if (this.props.livefeed) {
      this.props.setHub(hub);
    } else {
      this.props.updateCurrentHubPage(hub);
      Router.push("/hubs/[hubname]", `/hubs/${nameToUrl(hub.name)}`);
    }
  };

  render() {
    let { overrideStyle } = this.props;

    return (
      <div className={css(styles.container, overrideStyle && overrideStyle)}>
        <div className={css(styles.hubsListContainer)}>
          <div className={css(styles.listLabel)} id={"top-hub"}>
            {"Top Hubs"}
          </div>
          <div
            className={css(styles.hubsList, this.state.reveal && styles.reveal)}
          >
            {this.renderHubEntry()}
            <Link href={"/hubs"} as={"/hubs"}>
              <a className={css(styles.link)}>View all hubs</a>
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // width: "calc(100% * .625)",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 30,
  },
  hubsListContainer: {
    height: "100%",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    textAlign: "left",
    cursor: "default",
  },
  text: {
    fontFamily: "Roboto",
  },
  listLabel: {
    fontWeight: 400,
    marginBottom: 20,
    paddingLeft: 40,
    fontSize: 26,
    "@media only screen and (max-width: 1343px)": {
      fontSize: 22,
    },
    "@media only screen and (max-width: 1149px)": {
      fontSize: 22,
    },
    "@media only screen and (max-width: 665px)": {
      fontSize: 22,
      fontWeight: 500,
      marginBottom: 10,
    },
    "@media only screen and (max-width: 416px)": {
      fontWeight: 400,
      fontSize: 20,
    },
    "@media only screen and (max-width: 321px)": {
      width: 280,
      textAlign: "center",
    },
  },
  hubEntry: {
    fontSize: 16,
    fontWeight: 300,
    cursor: "pointer",
    textTransform: "capitalize",
    ":hover": {
      color: colors.BLUE(1),
    },
  },
  hubsList: {
    opacity: 0,
    width: "90%",
    boxSizing: "border-box",
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    paddingLeft: 40,
  },
  reveal: {
    opacity: 1,
    transition: "all ease-in-out 0.2s",
  },
  space: {
    height: 15,
  },
  subscribedIcon: {
    marginLeft: 3,
    color: colors.DARK_YELLOW(),
  },
  link: {
    textDecoration: "none",
    color: "rgba(78, 83, 255)",
    ":hover": {
      color: "rgba(78, 83, 255, .5)",
    },
  },
});

const mapStateToProps = (state) => ({
  hubs: state.hubs.topHubs,
});

const mapDispatchToProps = {
  updateCurrentHubPage: HubActions.updateCurrentHubPage,
  getHubs: HubActions.getHubs,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HubsList);
