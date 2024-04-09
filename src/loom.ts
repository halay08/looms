import dotenv from 'dotenv'
dotenv.config()

const workspaceId = process.env.LOOM_WORKSPACE_ID
const authCookie = process.env.LOOM_AUTH_COOKIE

const getHeaders = function () {
  const headers = new Headers()
  headers.append('Content-Type', 'application/json')
  headers.append('Cookie', authCookie!)

  return headers
}

export async function search(searchQuery: string = ''): Promise<any[]> {
  const headers = getHeaders()

  const body = JSON.stringify([
    {
      operationName: 'GlobalSearchQuery',
      variables: {
        searchQuery,
        workspaceId,
      },
      query:
        'query GlobalSearchQuery($searchQuery: String!, $workspaceId: ID!) {\n  videos: searchVideos {\n    ... on SearchVideosPayload {\n      videoResults(first: 10, searchQuery: $searchQuery) {\n        nodes {\n          video {\n            id\n            __typename\n          }\n          ...VideoSearchFragment\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  users: searchWorkspaceMembers(workspaceId: $workspaceId, query: $searchQuery) {\n    ... on SearchWorkspaceMembersResult {\n      users {\n        id\n        ...UserSearchFragment\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  tags: searchWorkspaceTags(query: $searchQuery) {\n    ... on MatchedTags {\n      tags {\n        tag\n        ...TagSearchFragment\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  folders: searchFolders(searchQuery: $searchQuery) {\n    ... on SearchFoldersPayload {\n      folders {\n        id\n        ...FolderSearchFragment\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n  spaces: searchSpaces {\n    ... on SearchSpacesPayload {\n      spaceResults(first: 10, searchQuery: $searchQuery) {\n        nodes {\n          space {\n            id\n            name\n            membersCount\n            totalVideos\n            isArchived\n            __typename\n          }\n          __typename\n        }\n        __typename\n      }\n      __typename\n    }\n    __typename\n  }\n}\n\nfragment UserSearchFragment on RegularUser {\n  id\n  display_name\n  email\n  avatars {\n    thumb\n    __typename\n  }\n  profileUri\n  profile {\n    profileVideoCount\n    __typename\n  }\n  __typename\n}\n\nfragment VideoSearchFragment on VideoSearchResult {\n  video {\n    id\n    name\n    sharePageUri\n    owner {\n      display_name\n      __typename\n    }\n    playable_duration\n    video_properties {\n      duration\n      trim_duration\n      __typename\n    }\n    processing_information {\n      trim_id\n      __typename\n    }\n    createdAt\n    __typename\n  }\n  matchedFields {\n    fieldName\n    __typename\n  }\n  __typename\n}\n\nfragment TagSearchFragment on Tag {\n  tag\n  count\n  uri\n  __typename\n}\n\nfragment FolderSearchFragment on RegularUserFolder {\n  id\n  name\n  totalNestedVideos\n  owner {\n    display_name\n    __typename\n  }\n  owner_id\n  space {\n    id\n    name\n    __typename\n  }\n  __typename\n}\n',
    },
  ])

  const requestOptions = {
    method: 'POST',
    headers,
    body,
  }

  const response = await fetch('https://www.loom.com/graphql', requestOptions)
  const [result] = await response.json()

  return result?.data?.videos?.videoResults?.nodes || []
}

export async function bulkDelete(searchQuery: string = '') {
  const videos = await search(searchQuery)

  const videoIds = videos.map((v) => v.video.id)

  const headers = getHeaders()

  const body = JSON.stringify([
    {
      operationName: 'BulkDeleteVideos',
      variables: {
        videoIds,
      },
      query:
        'mutation BulkDeleteVideos($videoIds: [ID]!) {\n  bulkDeleteVideos(videoIds: $videoIds) {\n    ... on BulkDeleteVideosPayload {\n      success\n      __typename\n    }\n    __typename\n  }\n}\n',
    },
  ])

  const requestOptions = {
    method: 'POST',
    headers,
    body,
  }

  const response = await fetch('https://www.loom.com/graphql', requestOptions)
  const [result] = await response.json()

  return result?.data?.bulkDeleteVideos
}
