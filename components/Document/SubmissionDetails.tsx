import { ReactElement, useState } from "react";
import { Hub } from "~/config/types/hub";
import { CreatedBy } from "~/config/types/root_types";
import AuthorAvatar from "../AuthorAvatar";
import HubDropDown from "../Hubs/HubDropDown";
import { timeSince } from "~/config/utils/dates";
import { toTitleCase } from "~/config/utils/string";
import { StyleSheet, css } from "aphrodite";
import ALink from "../ALink";
import colors from "~/config/themes/colors";
import { breakpoints } from "~/config/themes/screen";
import Bounty from "~/config/types/bounty";
import { ResearchCoinIcon } from "~/config/themes/icons";

type Args = {
  createdBy: CreatedBy | null;
  hubs: Array<Hub>;
  createdDate: string;
  avatarSize: number;
  bounties: Bounty[];
};

function SubmissionDetails({
  createdBy,
  hubs,
  createdDate,
  avatarSize = 30,
  bounties = [],
}: Args): ReactElement<"div"> {
  const showAllHubs =
    process.browser && window.innerWidth > breakpoints.medium.int;

  const [isHubsDropdownOpen, setIsHubsDropdownOpen] = useState(false);

  let sliceIndex = 1;
  if (showAllHubs) {
    sliceIndex = 3;
  }
  const visibleHubs = hubs?.slice(0, sliceIndex) ?? [];
  const hiddenHubs = hubs?.slice(sliceIndex) ?? [];

  const bounty =bounties?.[0];
  const authorProfile =
    bounty?.createdBy?.authorProfile ?? createdBy?.authorProfile;

  return (
    <div className={css(styles.submittedBy)}>
      <div className={css(styles.createdByContainer)}>
        <AuthorAvatar author={authorProfile} size={avatarSize} trueSize />
      </div>
      <div className={css(styles.submittedByDetails)}>
        <ALink
          href={`/user/${authorProfile?.id}/overview`}
          key={`/user/${authorProfile?.id}/overview-key`}
          overrideStyle={styles.link}
        >
          {authorProfile?.firstName || "Deleted"}{" "}
          {authorProfile?.lastName || "User"}
        </ALink>
        <div className={css(styles.hubsContainer)}>
          <>
            <span className={css(styles.textSecondary, styles.postedText)}>
              {` posted in`}
            </span>
            {visibleHubs.map((h, index) => (
              <span key={index}>
                <ALink
                  key={`/hubs/${h.slug ?? ""}-index`}
                  theme="blankAndBlue"
                  href={`/hubs/${h.slug}`}
                  overrideStyle={styles.hubLink}
                >
                  {toTitleCase(h.name)}
                </ALink>
                {index < visibleHubs?.length - 1 ? "," : ""}
              </span>
            ))}
            {hiddenHubs.length > 0 && (
              <HubDropDown
                hubs={hiddenHubs}
                labelStyle={styles.hubLink}
                containerStyle={styles.hubDropdownContainer}
                isOpen={isHubsDropdownOpen}
                setIsOpen={(isOpen) => setIsHubsDropdownOpen(isOpen)}
              />
            )}
          </>
        </div>
        <span className={css(styles.dot, styles.dotWithMargin)}> • </span>
        <span className={css(styles.textSecondary, styles.timestamp)}>
          {timeSince(createdDate)}
          {bounty && bounty.timeRemainingInDays <= 2 && (
            <span
              className={css(
                styles.expiringSoon
              )}
            >
              <span className={css(styles.dot, styles.dotWithMargin)}> • </span>
              bounty ending in {bounty.timeRemaining}
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  submittedBy: {
    display: "flex",
    alignItems: "center",
    fontSize: 14,
    lineHeight: "21px",
  },
  submittedByDetails: {
    display: "block",
  },
  postedText: {},
  createdByContainer: {
    marginRight: 7,
  },
  link: {
    cursor: "pointer",
    fontWeight: 400,
    ":hover": {
      color: colors.NEW_BLUE(),
    },
  },
  hubLink: {
    textTransform: "capitalize",
    marginLeft: 5,
    fontWeight: 400,
  },
  timestamp: {
    marginLeft: 2,
  },
  textSecondary: {
    color: colors.MEDIUM_GREY(),
  },
  hubsContainer: {
    display: "inline",
  },
  hubDropdownContainer: {
    display: "inline-block",
  },
  dot: {
    color: colors.MEDIUM_GREY(),
  },
  dotWithMargin: {
    marginLeft: 5,
    marginRight: 5,
  },
  rscIcon: {
    verticalAlign: "text-top",
    marginLeft: 5,
  },
  rscText: {
    fontWeight: 600,
    color: colors.ORANGE_DARK2(1),
    marginRight: 5,
    marginLeft: 2,
  },
  expiringSoon: {
    color: colors.RED(),
  },
});

export default SubmissionDetails;