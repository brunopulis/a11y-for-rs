const { DateTime } = require("luxon");
const CleanCSS = require('clean-css');
const talks = require('../_data/talks.js')

function unique(array) {
  return [...new Set(array)]
}

function readableDate(dateObj) {
  return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat("dd LLL yyyy");
}

module.exports = {
  cssmin: code => {
    return new CleanCSS({}).minify(code).styles;
  },
  getSelect: posts => posts.filter(post => post.data.isSelect),
  // Get the first `n` elements of a collection.
  head: (array, n) => {
    if( n < 0 ) {
      return array.slice(n);
    }

    return array.slice(0, n);
  },
  // Get the last `n` elements of a collection.
  tail: (array, n) => {
    if( n < 0 ) {
      return array.slice(n);
    }

    return array.slice(-n);
  },
  htmlDateString: (dateObj) => {
    return DateTime.fromJSDate(dateObj, {zone: 'utc'}).toFormat('yyyy-LL-dd');
  },
  readableDate,
  readableDateFromISO: (dateStr, formatStr = "dd LLL yyyy") => {
    return DateTime.fromISO(dateStr).toFormat(formatStr);
  },
  readableDateTimeFromISO: (dateStr, formatStr = "dd LLL yyyy 'at' hh:mma") => {
    return DateTime.fromISO(dateStr).toFormat(formatStr);
  },
  similarItems: (itemPath, tags, collections) => {
    const topicTags = tags.filter(tag => !["posts", "Popular"].includes(tag))

    let matches = []
    topicTags.forEach(tag => {
      matches = [...matches, ...collections[tag]]
    })

    let uniqueMatches = unique(matches).filter(match => match.url !== itemPath) // remove self
    if (uniqueMatches.length < 3) {
      uniqueMatches = unique([...uniqueMatches, ...collections["Popular"]])
    }
    const matchesByRelevance = uniqueMatches
      .filter(match => match.url !== itemPath) // remove self
      .map(match => {
        return {...match, relevance: getRelevance(topicTags, match)}
      })
      .sort((a, b) => {
        if (a.relevance > b.relevance) {
          return -1;
        }
        if (a.relevance < b.relevance) {
          return 1;
        }
        return 0;
      })
    const size = 3
    return matchesByRelevance.slice(0, size);
  },
  size: (mentions) => {
    return !mentions ? 0 : mentions.length
  },
  truncate: text => text.length > 300 ? `${text.substring(0, 300)}...` : text,
}