import { describe, it, expect } from 'vitest'
import { APPS, PROJECTS } from './projects'

/**
 * apps.json drives both the directory cards and the deploy, so a malformed entry breaks
 * production rather than just the UI.
 */
describe('apps.json', () => {
  it('has at least one app', () => {
    expect(APPS.length).toBeGreaterThan(0)
  })

  it.each(APPS)('$slug is well formed', (app) => {
    expect(app.slug).toMatch(/^[a-z0-9][a-z0-9-]*$/)
    expect(app.repo).toMatch(/^[\w.-]+\/[\w.-]+$/)
    expect(app.title.length).toBeGreaterThan(0)
    expect(app.description.length).toBeGreaterThan(0)
    expect(app.cover.startsWith('/')).toBe(true)
    expect(Number.isNaN(Date.parse(app.creationDate))).toBe(false)
  })

  it('always sets disabled, because filterProjects compares it strictly', () => {
    for (const app of APPS) {
      expect(typeof app.disabled).toBe('boolean')
    }
  })

  it('has no duplicate slugs', () => {
    const slugs = APPS.map((app) => app.slug)
    expect(new Set(slugs).size).toBe(slugs.length)
  })
})

describe('PROJECTS', () => {
  it('maps every app', () => {
    expect(PROJECTS).toHaveLength(APPS.length)
  })

  it('links each project at its own sub-path, with a trailing slash', () => {
    for (const project of PROJECTS) {
      expect(project.path).toBe(`/${project.id}/`)
    }
  })

  it('parses creationDate into a Date', () => {
    for (const project of PROJECTS) {
      expect(project.creationDate).toBeInstanceOf(Date)
      expect(Number.isNaN(project.creationDate.getTime())).toBe(false)
    }
  })
})
