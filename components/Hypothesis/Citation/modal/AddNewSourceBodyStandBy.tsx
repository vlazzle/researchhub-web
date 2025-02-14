// import ResearchhubOptionCard from "../../../ResearchhubOptionCard";
import { BodyTypeVals, NEW_SOURCE_BODY_TYPES } from "./modalBodyTypes";
import { breakpoints } from "~/config/themes/screen.js";
import { css, StyleSheet } from "aphrodite";
import { ReactElement, useEffect, useState } from "react";
import Button from "~/components/Form/Button";
import colors from "~/config/themes/colors";

const { NEW_PAPER_UPLOAD, SEARCH } = NEW_SOURCE_BODY_TYPES;

type Props = {
  setBodyType: (bodyType: BodyTypeVals) => void;
};

export default function AddNewSourceBodyStandBy({
  setBodyType,
}: Props): ReactElement<"div"> {
  const [activeBodyType, setActiveBodyType] = useState<BodyTypeVals>(
    NEW_PAPER_UPLOAD
  );

  useEffect(() => {
    setBodyType(activeBodyType);
  }, []);

  return (
    <div className={css(styles.addNewSourceBodyStandBy)}>
      <div className={css(styles.title)}>{"Add a new Paper"}</div>
      {/* <ResearchhubOptionCard
        description="Upload a new paper that does not exist on ResearchHub"
        header="Upload a new paper"
        imgSrc="/static/icons/uploadPaper.png"
        isActive={activeBodyType === NEW_PAPER_UPLOAD}
        isCheckboxSquare={false}
        key={NEW_PAPER_UPLOAD}
        onSelect={(): void => setActiveBodyType(NEW_PAPER_UPLOAD)}
      />
      <ResearchhubOptionCard
        description="I would like to cite a source that already exists on ResearchHub"
        header="Search for a source on ResearchHub"
        imgSrc="/static/icons/search.png"
        isActive={activeBodyType === SEARCH}
        isCheckboxSquare={false}
        key={SEARCH}
        onSelect={(): void => setActiveBodyType(SEARCH)}
      /> */}
      <div className={css(styles.buttonWrap)}>
        <Button
          customButtonStyle={styles.buttonCustomStyle}
          customLabelStyle={styles.buttonLabel}
          label="Next"
          onClick={(): void => setBodyType(activeBodyType)}
        />
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  addNewSourceBodyStandBy: {
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    margin: "36px 36px 26px",
  },
  buttonCustomStyle: {
    height: "50px",
    width: "160px",
    [`@media only screen and (max-width: ${breakpoints.xxsmall.str})`]: {
      width: "160px",
      height: "50px",
    },
  },
  buttonLabel: {
    alignItems: "center",
    display: "flex",
    height: "100%",
    justifyContent: "center",
    width: "100%",
  },
  buttonWrap: {
    marginTop: 16,
  },
  title: {
    alignItems: "center",
    color: colors.BLACK(1),
    display: "flex",
    fontSize: 26,
    fontWeight: 500,
    height: 30,
    justifyContent: "center",
    width: "100%",
    marginBottom: 16,
    "@media only screen and (max-width: 725px)": {
      width: 450,
    },
    "@media only screen and (max-width: 557px)": {
      width: 380,
      fontSize: 24,
    },
    "@media only screen and (max-width: 415px)": {
      width: 300,
      fontSize: 22,
    },
    "@media only screen and (max-width: 321px)": {
      width: 280,
    },
  },
});
