import React, { Component } from 'react'
import Layout from '../components/Layout'
import Head from 'next/head'
import withRoot from '../components/withRoot'
import { getJSON } from '../utils/fetch'
import debounce from 'lodash.debounce'

class Page extends Component {
  /**
   * Make api call based on searchTerm
   * Render cards from api data
   */
  fetchSearchTerm = searchTerm => {
    const apiUrl = 'http://104.236.41.59/wp-json/wp/v2/'
    const params = `multiple-post-type?search=${searchTerm}&type[]=post&type[]=page&type[]=admissions-page&type[]=chapel-page`
    getJSON(apiUrl + params).then(data => this.setState({ data }))
    console.log(this.state.data)
  }

  // Get a new function that is debounced when called
  debouncedSearch = debounce(this.fetchSearchTerm, 700)

  /**
   * Called onSubmit event
   */
  formGetResults = e => {
    e.preventDefault()
    const { search } = e.target
    // unfocusing input makes soft keyboard to close
    window.outerWidth < 1024 && search.blur()
    // cancel any pending search
    this.debouncedSearch.cancel()
    this.fetchSearchTerm(search.value)
  }

  /**
   * Called onChange event
   */
  getSearchResults = e => {
    var { value } = e.target
    if (value.length < 3) return
    this.debouncedSearch(value)
  }

  pricePicker = e => {
    const freeVal = document.getElementById('free').checked
    const paidVal = document.getElementById('paid').checked

    if ((freeVal && paidVal) || (!freeVal && !paidVal)) {
      this.setState({ price: 'all' })
    } else if (freeVal) {
      this.setState({ price: 'free' })
    } else {
      this.setState({ price: 'paid' })
    }
  }

  priceFilter = post => {
    if (this.state.price === 'all') {
      return true
    } else if (post.acf.price === this.state.price) {
      return true
    } else {
      return false
    }
  }

  filterByCategory = post => {
    if (this.state.category === 0) {
      return true
    } else if (post['resource-category'] !== undefined) {
      return post['resource-category'].some(
        category => category === this.state.category
      )
    } else {
      return false
    }
  }

  setCategory = catNum => {
    this.setState({ category: parseInt(catNum) })
  }

  render () {
    return (
      <Layout>
        <Head>
          <link
            rel="stylesheet"
            href="/static/styles/page.css"
            type="text/css"
          />
        </Head>

        <form onSubmit={this.formGetResults}>
          <input
            id="search"
            name="search"
            onChange={this.getSearchResults}
            type="search"
            style={{ width: '100%', paddingLeft: '4px' }}
          />
          <label htmlFor="search">Search</label>
          <svg fill="#fff" height="24" viewBox="0 0 24 24" width="24">
            <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            <path d="M0 0h24v24H0z" fill="none" />
          </svg>
        </form>
        {this.state.data
          ? this.state.data.map(item => (
            <div key={item.id}>{item.title.rendered}</div>
          ))
          : null}
      </Layout>
    )
  }
}

export default withRoot(Page)