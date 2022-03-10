import { ID } from "~/config/types/root_types";
import { isNullOrUndefined, nullthrows } from "~/config/utils/nullchecks";
import { NextRouter } from "next/router";
import { UnifiedDocFilters } from "../constants/UnifiedDocFilters";
import { useEffect } from "react";
import { useState } from "react";
import fetchUnifiedDocs from "../api/unifiedDocFetch";

export type UniDocFetchParams = {
  docTypeFilter: null | string | undefined;
  hubID: ID;
  isLoggedIn: Boolean;
  onError: Function;
  onSuccess: Function;
  page: number;
  subFilters: any;
  subscribedHubs: Boolean;
  hotV2: Boolean;
  nonceRef?: any;
  nonce?: string;
};

export type PaginationInfo = {
  hasMore: Boolean;
  isLoading: Boolean;
  isLoadingMore: Boolean;
  isServerLoaded: Boolean;
  localPage: number; // for UI
  page: number; // for BE
};

export const getFilterFromRouter = (router: NextRouter): string => {
  const docType = router.query.type;
  return isNullOrUndefined(docType)
    ? UnifiedDocFilters.ALL
    : Array.isArray(docType)
    ? nullthrows(docType[0])
    : nullthrows(docType);
};

export const getPaginationInfoFromServerLoaded = (
  serverLoadedData: any
): PaginationInfo => {
  return {
    hasMore: !isNullOrUndefined(serverLoadedData?.next),
    isLoading: isNullOrUndefined(serverLoadedData),
    isLoadingMore: false,
    isServerLoaded: !isNullOrUndefined(serverLoadedData),
    localPage: 1,
    page: 1,
  };
};

export const useEffectUpdateStatesOnServerChanges = ({
  setPaginationInfo,
  setUnifiedDocuments,
  serverLoadedData,
  routePath,
}): void => {
  useEffect((): void => {
    setPaginationInfo(getPaginationInfoFromServerLoaded(serverLoadedData));
    setUnifiedDocuments(serverLoadedData?.results || []);
  }, [routePath, serverLoadedData]);
};

export const useEffectPrefetchNext = ({
  fetchParams,
  prevFetchParams,
  setPrevFetchParams,
  setIsPrefetching,
  shouldPrefetch,
}: {
  fetchParams: UniDocFetchParams;
  prevFetchParams: UniDocFetchParams | null;
  setPrevFetchParams: any;
  setIsPrefetching: (flag: boolean) => void;
  shouldPrefetch: Boolean;
}): void => {
  const {
    docTypeFilter: prevDocTypeFilter,
    subFilters: prevSubFilters,
    page: prevPage,
  } = prevFetchParams ?? {};
  const { docTypeFilter, subFilters, page } = fetchParams ?? {};

  useEffect((): void => {
    const readyToPrefetch =
      shouldPrefetch &&
      prevPage !== page &&
      (prevFetchParams === null ||
        (prevDocTypeFilter == docTypeFilter && prevSubFilters == subFilters));

    if (readyToPrefetch) {
      setIsPrefetching(true);
      fetchUnifiedDocs(fetchParams);
      setPrevFetchParams(fetchParams);
    }
  }, [
    shouldPrefetch,
    prevDocTypeFilter,
    prevSubFilters,
    docTypeFilter,
    subFilters,
  ]);
};

function makeid(length) {
  var result           = '';
  var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * 
charactersLength));
 }
 return result;
}

export const useEffectForceUpdate = ({
  fetchParams,
  updateOn,
  setUnifiedDocsLoading,
  firstLoad,
  nonceRef,
}: {
  fetchParams: UniDocFetchParams;
  updateOn: any[];
  setUnifiedDocsLoading: any;
  firstLoad: any;
  nonceRef: any;
}): void => {
  useEffect((): void => {
    const nonce = makeid(16);
    nonceRef.current = nonce;
    if (firstLoad?.current) {
      fetchParams.nonceRef = nonceRef;
      fetchParams.nonce = nonce;
      setUnifiedDocsLoading && setUnifiedDocsLoading(true);
      fetchUnifiedDocs(fetchParams);
    } else if (firstLoad) {
      firstLoad.current = true;
    }
  }, [...updateOn]);
};

const useEffectHandleFetch = ({
  fetchParams,
  updateOn,
  setUnifiedDocsLoading,
  firstLoad,
}: {
  fetchParams: UniDocFetchParams;
  updateOn: any[];
  setUnifiedDocsLoading: any;
  firstLoad: any;
}): void => {};
