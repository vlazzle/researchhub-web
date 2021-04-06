import { css, StyleSheet } from "aphrodite";
import React, { useEffect, useMemo, useState } from "react";
import Popover from "react-popover";
import InlineCommentStore, {
  cleanupStoreAndCloseDisplay,
  findTargetInlineComment,
  getSavedInlineCommentsGivenBlockKey,
  updateInlineComment,
} from "./undux/InlineCommentUnduxStore";
import PaperDraftStore from "../PaperDraft/undux/PaperDraftUnduxStore";

function PaperDraftInlineCommentTextWrap(
  props /* prop comes in from draft-js */
) {
  const { blockKey, contentState, decoratedText, entityKey } = props ?? {};
  const inlineCommentStore = InlineCommentStore.useStore();
  const paperDraftStore = PaperDraftStore.useStore();
  const isSilenced = inlineCommentStore
    .get("silencedPromptKeys")
    .has(entityKey);
  const isBeingPrompted =
    inlineCommentStore.get("promptedEntityKey") === entityKey;

  const [showPopover, setShowPopover] = useState(
    !isSilenced && isBeingPrompted
  );
  useEffect(() => {
    // ensures popover renders properly despite race condition
    if (!showPopover && isBeingPrompted) {
      setShowPopover(true);
    }
  }, [showPopover, isBeingPrompted]);

  const isCommentSavedInBackend = commentThreadID != null;
  const doesCommentExistInStore =
    findTargetInlineComment({
      blockKey,
      commentThreadID,
      entityKey,
      store: inlineCommentStore,
    }) != null;
  console.warn(
    "decoratedText: ",
    decoratedText,
    " isCommentSavedInBackend: ",
    isCommentSavedInBackend,
    " doesCommentExistInStore: ",
    doesCommentExistInStore
  );
  const shouldTextBeHighlighted =
    doesCommentExistInStore || isCommentSavedInBackend;
  // const [shouldTextBeHighlighted, setShouldTextBeHighlighted] = useState(

  // );
  // useEffect(() => {
  //   // ensures popover renders properly despite race condition
  //   if (!showPopover && isBeingPrompted) {
  //     setShouldTextBeHighlighted(false);
  //   }
  // }, [showPopover, isBeingPrompted]);

  const data = contentState.getEntity(props.entityKey).getData();
  const { commentThreadID } = data;

  const hidePopoverAndInsertToStore = (event) => {
    event.stopPropagation();
    cleanupStoreAndCloseDisplay({
      inlineCommentStore,
    });
    inlineCommentStore.set("silencedPromptKeys")(
      new Set([...inlineCommentStore.get("silencedPromptKeys"), entityKey])
    );
    inlineCommentStore.set("promptedEntityKey")(null);
    inlineCommentStore.set("lastPromptRemovedTime")(Date.now());
    const newInlineComment = {
      blockKey,
      commentThreadID,
      entityKey,
      highlightedText: decoratedText,
      store: inlineCommentStore,
    };
    updateInlineComment({
      store: inlineCommentStore,
      updatedInlineComment: newInlineComment,
    });
    const displayableComments = [
      newInlineComment,
      ...getSavedInlineCommentsGivenBlockKey({
        blockKey,
        editorState: paperDraftStore.get("editorState"),
      }),
    ];
    inlineCommentStore.set("displayableInlineComments")(displayableComments);
    setShowPopover(false);
  };

  const hidePopoverAndSilence = (event) => {
    event.stopPropagation();
    cleanupStoreAndCloseDisplay({ inlineCommentStore });
    inlineCommentStore.set("silencedPromptKeys")(
      new Set([...inlineCommentStore.get("silencedPromptKeys"), entityKey])
    );
    inlineCommentStore.set("lastPromptRemovedTime")(Date.now());
    inlineCommentStore.set("promptedEntityKey")(null);
    setShowPopover(false);
  };

  const openCommentThreadDisplay = (event) => {
    event.stopPropagation();
    inlineCommentStore.set("displayableInlineComments")(
      getSavedInlineCommentsGivenBlockKey({
        blockKey,
        editorState: paperDraftStore.get("editorState"),
      })
    );
  };

  return (
    <Popover
      above
      key={`Popver-${entityKey}`}
      onOuterAction={isBeingPrompted ? hidePopoverAndSilence : () => {}}
      body={
        <span
          key={`Popver-Body-${entityKey}`}
          className={css(styles.popoverBodyStyle)}
          role="none"
          onClick={hidePopoverAndInsertToStore}
        >
          {"Add Comment"}
        </span>
      }
      children={
        <span
          className={css(
            shouldTextBeHighlighted
              ? styles.commentTextHighLight
              : styles.textNonHighLight
          )}
          id={
            commentThreadID != null
              ? `inline-comment-${commentThreadID}`
              : entityKey
          }
          key={`Popver-Child-${entityKey}`}
          onClick={openCommentThreadDisplay}
          role="none"
        >
          {props.children}
        </span>
      }
      isOpen={showPopover}
    />
  );
}

const styles = StyleSheet.create({
  commentTextHighLight: {
    cursor: "pointer",
    backgroundColor: "rgb(204 243 221)",
  },
  popoverBodyStyle: {
    background: "rgb(0,0,0)",
    color: "rgb(255, 255, 255)",
    cursor: "pointer",
    fontSize: 14,
    padding: "8px 16px",
    borderRadius: 5,
  },
  textNonHighLight: {
    backgroundColor: "transparent",
  },
});

export default PaperDraftInlineCommentTextWrap;
