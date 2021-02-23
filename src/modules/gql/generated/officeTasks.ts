/* eslint-disable */

/** 
* ФАЙЛ ГЕНЕРИРУЕТСЯ АВТОМАТИЧЕСКИ, ПРАВИТЬ ЕГО НЕ НУЖНО 
* Команда для генерирования этого файла: "yarn generate:types" 
*/


import * as Types from './types';

import { OfficeTaskFragment } from './officeTask';
import { gql } from '@apollo/client';
import { OfficeTaskFragmentDoc } from './officeTask';
import * as Apollo from '@apollo/client';
export type OfficeTasksQueryVariables = Types.Exact<{
  orderBy?: Types.Maybe<Types.TaskOrderByInput>;
  where?: Types.Maybe<Types.TaskWhereInput>;
}>;


export type OfficeTasksQuery = { __typename?: 'Query', tasksConnection: { __typename?: 'TaskConnection', aggregate: { __typename?: 'AggregateTask', count: number }, edges: Array<Types.Maybe<{ __typename?: 'TaskEdge', node: (
        { __typename?: 'Task' }
        & OfficeTaskFragment
      ) }>> } };


export const OfficeTasksDocument = gql`
    query officeTasks($orderBy: TaskOrderByInput, $where: TaskWhereInput) {
  tasksConnection(orderBy: $orderBy, where: $where) {
    aggregate {
      count
    }
    edges {
      node {
        ...officeTask
      }
    }
  }
}
    ${OfficeTaskFragmentDoc}`;

/**
 * __useOfficeTasksQuery__
 *
 * To run a query within a React component, call `useOfficeTasksQuery` and pass it any options that fit your needs.
 * When your component renders, `useOfficeTasksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useOfficeTasksQuery({
 *   variables: {
 *      orderBy: // value for 'orderBy'
 *      where: // value for 'where'
 *   },
 * });
 */
export function useOfficeTasksQuery(baseOptions?: Apollo.QueryHookOptions<OfficeTasksQuery, OfficeTasksQueryVariables>) {
        return Apollo.useQuery<OfficeTasksQuery, OfficeTasksQueryVariables>(OfficeTasksDocument, baseOptions);
      }
export function useOfficeTasksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<OfficeTasksQuery, OfficeTasksQueryVariables>) {
          return Apollo.useLazyQuery<OfficeTasksQuery, OfficeTasksQueryVariables>(OfficeTasksDocument, baseOptions);
        }
export type OfficeTasksQueryHookResult = ReturnType<typeof useOfficeTasksQuery>;
export type OfficeTasksLazyQueryHookResult = ReturnType<typeof useOfficeTasksLazyQuery>;
export type OfficeTasksQueryResult = Apollo.QueryResult<OfficeTasksQuery, OfficeTasksQueryVariables>;