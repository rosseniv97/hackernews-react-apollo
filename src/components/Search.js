import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import gql from 'graphql-tag'
import { updateCacheAfterVote } from '../utils'
import Link from './Link'

const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
      links {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
    }
  }
`

class Search extends Component {
    state = {
        links: [],
        filter: ''
    }
    render() {
        return (
            <div>
                <div>
                    Search:
                    <input
                        type="text"
                        onChange={e => this.setState({ filter: e.target.value })}
                    />
                    <button onClick={() => this._executeSearch()}>OK</button>
                </div>
                <div>
                    {this.state.links.map((link, index) => (
                        <Link
                            key={link.id}
                            link={link}
                            index={index}
                            updateStoreAfterVote={updateCacheAfterVote}
                        />
                    ))}
                </div>
            </div>
        )
    }

    _executeSearch = async () => {
        const filter = this.state.filter;
        const result = await this.props.client.query({
            query: FEED_SEARCH_QUERY,
            variables: { filter }
        })
        const links = result.data.feed.links
        this.setState({ links: links })
    }
}

export default withApollo(Search)