import { filterNull } from "~/config/utils/nullchecks";
import { getUnifiedDocType } from "~/config/utils/getUnifiedDocType";
import { css, StyleSheet } from "aphrodite";
import HypothesisCard from "../document_cards/HypothesisCard";
import PaperEntryCard from "~/components/Hubs/PaperEntryCard";
import React, { ReactElement } from "react";
import UserPostCard from "~/components/Author/Tabs/UserPostCard";
import DiscussionThreadCard from "~/components/DiscussionThreadCard";
import { genericCardColors } from "~/config/themes/colors";
import { useRouter } from "next/router";

export type UnifiedCard = ReactElement<
  typeof PaperEntryCard | typeof UserPostCard
> | null;

export function getDocumentCard({
  hasSubscribed,
  isLoggedIn,
  isOnMyHubsTab,
  setUnifiedDocuments,
  unifiedDocumentData,
}): UnifiedCard[] {
  const router = useRouter();

  return filterNull(unifiedDocumentData).map(
    (uniDoc: any, arrIndex: number): UnifiedCard => {
      const formattedDocType = getUnifiedDocType(uniDoc?.document_type ?? null);

      const targetDoc =
        formattedDocType === "comment"
          ? { ...uniDoc }
          : formattedDocType !== "post"
          ? uniDoc.documents
          : uniDoc.documents[0];

      const docID = targetDoc.id;
      const shouldBlurMobile =
        arrIndex > 1 && (!hasSubscribed || !isLoggedIn) && isOnMyHubsTab;
      const shouldBlurDesktop =
        arrIndex > 1 && (!hasSubscribed || !isLoggedIn) && isOnMyHubsTab;

      switch (formattedDocType) {
        case "post":
          return (
            <UserPostCard
              {...targetDoc}
              formattedDocType={formattedDocType}
              key={`${formattedDocType}-${docID}-${arrIndex}`}
              style={[
                styles.customUserPostCard,
                shouldBlurMobile && styles.mobileBlurCard,
                shouldBlurDesktop && styles.desktopBlurCard,
              ]}
            />
          );
        case "hypothesis":
          return (
            <HypothesisCard
              {...targetDoc}
              formattedDocType={formattedDocType}
              key={`${formattedDocType}-${docID}-${arrIndex}`}
              style={[
                styles.customUserPostCard,
                shouldBlurMobile && styles.mobileBlurCard,
                shouldBlurDesktop && styles.desktopBlurCard,
              ]}
            />
          );
        case "paper":
          return (
            <PaperEntryCard
              index={arrIndex}
              key={`${formattedDocType}-${docID}-${arrIndex}`}
              paper={uniDoc.documents}
              style={[
                shouldBlurMobile && styles.mobileBlurCard,
                shouldBlurDesktop && styles.desktopBlurCard,
              ]}
              vote={uniDoc.user_vote}
              voteCallback={(arrIndex: number, currPaper: any): void => {
                const [currUniDoc, newUniDocs] = [
                  { ...uniDoc },
                  [...unifiedDocumentData],
                ];
                currUniDoc.documents.user_vote = currPaper.user_vote;
                currUniDoc.documents.score = currPaper.score;
                newUniDocs[arrIndex] = currUniDoc;
                setUnifiedDocuments(newUniDocs);
              }}
            />
          );
        case "comment":
          console.log(targetDoc);
          let path = "";
          let nextPath = "";
          let postId = null;
          let paperId = null;
          if (targetDoc.unified_document.document_type === "DISCUSSION") {
            const post = targetDoc.unified_document.documents[0];
            path = `/post/${post.id}/${post.slug}`;
            nextPath = `/post/[documentId]/[title]`;
            postId = post.id;
          }
          return (
            <div className={css(styles.discussionCard)}>
              <DiscussionThreadCard
                data={targetDoc.source}
                hostname={window.location.href}
                path={path}
                paperId={paperId}
                postId={postId}
                className={styles.discussionClass}
                discussionContainerStyle={styles.discussionContainerStyle}
                goToDiscussion={() => {
                  router.push(nextPath, path);
                }}
              />
            </div>
          );
        default:
          return null;
      }
    }
  );
}

const styles = StyleSheet.create({
  customUserPostCard: {
    marginBottom: 12,
    marginTop: 12,
  },
  desktopBlurCard: {
    "@media only screen and (min-width: 768px)": {
      display: "none",
    },
  },
  mobileBlurCard: {
    "@media only screen and (max-width: 767px)": {
      display: "none",
    },
  },
  discussionCard: {
    background: "#fff",
    border: `1px solid ${genericCardColors.BORDER}`,
    marginBottom: 16,
    cursor: "pointer",
  },
  discussionClass: {
    border: 0,
    padding: 16,
    boxSizing: "border-box",
    cursor: "pointer",
  },
  discussionContainerStyle: {
    padding: 0,
    border: 0,
  },
});
