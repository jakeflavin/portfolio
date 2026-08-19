import { describe, it, expect } from 'vitest'
import { parseDirectoryState, toQueryString, DEFAULT_SORT, DEFAULT_VIEW } from './home.utils'

describe('directory state in the URL', () => {
  it('falls back to defaults for an empty query string', () => {
    expect(parseDirectoryState('')).toEqual({
      searchQuery: '',
      sortBy: DEFAULT_SORT,
      view: DEFAULT_VIEW,
    })
  })

  it('reads a full query string', () => {
    expect(parseDirectoryState('?q=running&sort=title-asc&view=grid')).toEqual({
      searchQuery: 'running',
      sortBy: 'title-asc',
      view: 'grid',
    })
  })

  // A hand-edited or stale link must not put the directory into a state it cannot render.
  it('ignores values that are not real options', () => {
    const state = parseDirectoryState('?sort=sideways&view=carousel')
    expect(state.sortBy).toBe(DEFAULT_SORT)
    expect(state.view).toBe(DEFAULT_VIEW)
  })

  it('omits defaults so an untouched directory has a clean URL', () => {
    expect(toQueryString({ searchQuery: '', sortBy: DEFAULT_SORT, view: DEFAULT_VIEW })).toBe('')
  })

  it('keeps only what was actually changed', () => {
    expect(toQueryString({ searchQuery: '  hat  ', sortBy: DEFAULT_SORT, view: 'list' })).toBe(
      '?q=hat&view=list',
    )
  })

  it('round-trips', () => {
    const state = { searchQuery: 'weather', sortBy: 'title-desc' as const, view: 'grid' as const }
    expect(parseDirectoryState(toQueryString(state))).toEqual(state)
  })
})
