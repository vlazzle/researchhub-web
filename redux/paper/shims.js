import { transformDate, transformUser, transformVote } from "../utils";

export const paper = (paper) => {
  return {
    ...paper,
    publishedDate: transformDate(paper.paper_publish_date),
    tagline: paper.tagline,
    discussion: {
      count: paper.discussion ? paper.discussion.count : null,
      // threads: paper.discussion
      //   ? paper.discussion.threads
      //   : [],
      filter:
        paper.discussion && paper.discussion.filter
          ? paper.discussion.filter
          : null,
      next:
        paper.discussion && paper.discussion.next
          ? paper.discussion.next
          : null,
      source:
        paper.discussion && paper.discussion.source
          ? paper.discussion.source
          : "researchhub",
    },
    metatagImage: paper.metatag_image,
    userVote: transformVote(paper.user_vote),
  };
};

// NOTE: calvinhlee - why was this even necessary?
export const paperPost = ({
  abstract,
  authors,
  citation_type,
  doi,
  file,
  hubs,
  hypothesis_id,
  paper_title,
  paper_type,
  publishDate,
  raw_authors,
  tagline,
  title,
  type,
  url,
}) => {
  let formData = new FormData();
  authors &&
    authors.length &&
    authors.forEach((author) => {
      return formData.append("authors", JSON.stringify(author));
    });

  if (raw_authors) {
    if (raw_authors.length) {
      raw_authors.forEach((raw_author) => {
        return formData.append(`raw_authors`, JSON.stringify(raw_author));
      });
    }
  }
  // NOTE - calvinhlee: formatting data like below results in unexpected update behavior.
  hubs &&
    hubs.forEach((hub) => {
      return formData.append("hubs", hub);
    });
  doi && formData.append("doi", doi);
  // no boolean check for title because empty string is falsey in js.
  title && formData.append("title", title);
  file && formData.append("file", file);
  publishDate && formData.append("paper_publish_date", publishDate);
  url && formData.append("url", url);
  type && formData.append("publication_type", type);
  tagline && formData.append("tagline", tagline);
  abstract && formData.append("abstract", abstract);
  paper_title && formData.append("paper_title", paper_title);
  paper_type && formData.append("paper_type", paper_type);
  hypothesis_id && formData.append("hypothesis_id", hypothesis_id);
  citation_type && formData.append("citation_type", citation_type);
  return formData;
};

export const editHistory = (editHistory) => {
  return editHistory.map((edit) => {
    return transformEdit(edit);
  });
};

export const paperSummaryPost = ({ paperId, text }) => {
  return {
    paper: paperId,
    summary: text,
  };
};

export const vote = (vote) => {
  return transformVote(vote);
};

export function transformThreads(threads) {
  return threads.map((thread) => {
    if (thread.transform) {
      return thread;
    }
    if (thread.source === "twitter") {
      return {
        id: thread.id,
        commentCount: thread.comment_count,
        comments: transformComments(thread.comments),
        createdBy: thread.external_metadata
          ? {
              authorProfile: {
                first_name: thread.external_metadata.username,
                last_name: "",
                profile_image: thread.external_metadata.picture,
              },
            }
          : {},
        url: thread.external_metadata ? thread.external_metadata.url : "",
        createdDate: transformDate(thread.created_date),
        ipAddress: thread.ip_address,
        isPublic: thread.is_public,
        isRemoved: thread.is_removed,
        paper: thread.paper,
        plainText: thread.plain_text,
        score: thread.score,
        source: thread.source,
        sourceId: thread.source_id,
        text: thread.text,
        updatedDate: thread.updated_date,
        userFlag: thread.user_flag,
        userVote: thread.user_vote,
        username: thread.username,
        wasEdited: thread.wasEdited,
        transform: true,
      };
    }
    if (thread.created_by) {
      return {
        id: thread.id,
        title: thread.title,
        text: thread.text,
        paper: thread.paper,
        commentCount: thread.comment_count,
        createdBy: transformUser(thread.created_by),
        createdDate: transformDate(thread.created_date),
        isPublic: thread.is_public,
        score: thread.score,
        userVote: transformVote(thread.user_vote),
        comments: transformComments(thread.comments),
        isRemoved: thread.is_removed,
        userFlag: thread.user_flag,
        transform: true,
      };
    } else {
      return thread;
    }
  });
}

function transformEdit(edit) {
  return {
    id: edit.id,
    proposedBy: transformUser(edit.proposed_by),
    summary: edit.summary,
    previousSummary: edit.previous__summary,
    approved: edit.approved,
    approvedBy: transformUser(edit.approved_by),
    approvedDate: edit.approved_date,
    createdDate: edit.created_date,
    updatedDate: edit.updated_date,
    paper: edit.paper,
    score: edit.score,
    user_vote: edit.user_vote,
  };
}

export function transformComments(comments) {
  return comments.map((comment) => {
    return transformComment(comment);
  });
}

export function transformComment(comment) {
  if (comment.transform) {
    return comment;
  }
  if (comment.source === "twitter") {
    return {
      id: comment.id,
      replyCount: comment.reply_count,
      replies: transformReplies(comment.replies),
      createdBy: comment.external_metadata
        ? {
            authorProfile: {
              first_name: comment.external_metadata.username,
              last_name: "",
              profile_image: comment.external_metadata.picture,
            },
          }
        : {},
      url: comment.external_metadata ? comment.external_metadata.url : "",
      createdDate: transformDate(comment.created_date),
      ipAddress: comment.ip_address,
      isPublic: comment.is_public,
      isRemoved: comment.is_removed,
      paper: comment.paper_id,
      parent: comment.parent,
      plainText: comment.plain_text,
      score: comment.score,
      source: comment.source,
      sourceId: comment.source_id,
      text: comment.text,
      updatedDate: comment.updated_date,
      userFlag: comment.user_flag,
      userVote: comment.user_vote,
      username: comment.username,
      wasEdited: comment.wasEdited,
      transform: true,
    };
  }
  return {
    id: comment.id,
    text: comment.text,
    thread: comment.parent,
    createdBy: transformUser(comment.created_by),
    createdDate: comment.created_date,
    score: comment.score,
    userVote: transformVote(comment.user_vote),
    replies: transformReplies(comment.replies),
    replyCount: comment.reply_count,
    thread: comment.thread,
    isRemoved: comment.is_removed,
    userFlag: comment.user_flag,
    transform: true,
  };
}

function transformReplies(replies) {
  return (
    replies &&
    replies
      .map((reply) => {
        return transformReply(reply);
      })
      .sort((a, b) => {
        if (a.createdDate < b.createdDate) {
          return -1;
        } else if (a.createdDate > b.createdDate) {
          return 1;
        }
        return 0;
      })
  );
}

export function transformReply(reply) {
  return {
    id: reply.id,
    text: reply.text,
    comment: reply.parent,
    createdBy: transformUser(reply.created_by),
    createdDate: reply.created_date,
    score: reply.score,
    userVote: transformVote(reply.user_vote),
    thread: reply.thread,
    isRemoved: reply.is_removed,
    userFlag: reply.user_flag,
  };
}
