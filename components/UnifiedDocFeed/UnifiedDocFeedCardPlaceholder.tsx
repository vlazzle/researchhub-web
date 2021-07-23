import React, { Fragment } from "react";
import { StyleSheet, css } from "aphrodite";

import { TextBlock, RoundShape } from "react-placeholder/lib/placeholders";

export default function UnifiedDocFeedCardPlaceholder({ color }) {
  return (
    <div
      className={css(styles.placeholderContainer) + " show-loading-animation"}
    >
      <div className={css(styles.spaceBetween)}>
        <div className={css(styles.column)}>
          <div className={css(styles.header)}>
            <TextBlock
              className={css(styles.textRow)}
              rows={1}
              color={color}
              style={{ width: "100%" }}
            />
            <TextBlock
              className={css(styles.textRow)}
              rows={1}
              color={color}
              style={{ width: "100%" }}
            />
            <TextBlock
              className={css(styles.textRow, styles.paddingTop)}
              rows={1}
              color={color}
              style={{ width: "100%" }}
            />
          </div>
          <div className={css(styles.row)}>
            <div style={{ width: "35%" }}>
              <TextBlock
                rows={1}
                color={color}
                style={{ width: "100%", paddingRight: 50 }}
              />
            </div>
            <TextBlock
              rows={1}
              color={color}
              style={{ paddingLeft: 30, width: "50%" }}
            />
          </div>
          <div className={css(styles.row, styles.marginBottom, styles.bottom)}>
            <div className={css(styles.row)}>
              <RoundShape color={color} style={{ width: 30, height: 30 }} />
              <RoundShape
                color={color}
                style={{ width: 30, height: 30, margin: "0px 10px" }}
              />
              <RoundShape
                color={color}
                style={{ width: 30, height: 30, marginRight: 10 }}
              />
              <RoundShape
                color={color}
                style={{ width: 30, height: 30, marginRight: 10 }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const styles = StyleSheet.create({
  placeholderContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
    paddingTop: 10,
  },
  round: {
    width: 53,
    height: 25,
    position: "absolute",
    top: 32,
    left: -70,
  },
  voteContainer: {
    position: "absolute",
    left: -70,
    top: 10,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    paddingBottom: 20,
  },
  paddingTop: {
    paddingTop: 8,
  },
  textRow: {},
  column: {
    width: "100%",
    display: "flex",
    flexDirection: "column",
  },
  columnRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
  },
  row: {
    display: "flex",
    marginBottom: 15,
  },
  spaceBetween: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  marginBottom: {
    marginBottom: 0,
  },
  bottom: {
    marginTop: 20,
    marginBottom: 0,
  },
  space: {},
  label: {},
});
