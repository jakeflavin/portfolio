import React, { useState } from 'react'
import { ArrowUpRight, Send, Check } from 'lucide-react'
import { BrandIcon } from '@/components/BrandIcon'
import { Actions, ActionButton, ActionLink } from './ProjectActions.styled'

export const ACTION_ICON_SIZE = 18

export interface ProjectActionsProps {
  title: string
  /** Where the project is served from. Absent means it is not linkable yet. */
  href?: string
  /** `owner/name` on GitHub, linked at the end of the row. */
  repo?: string
}

/**
 * Open, copy link, source. The card and the grid's hover panel both use this, which is the
 * only reason the copy behaviour below exists once rather than twice.
 */
export function ProjectActions({ title, href, repo }: ProjectActionsProps) {
  const [copied, setCopied] = useState(false)

  /**
   * clipboard.writeText rejects on a permission denial, an unfocused document, or an
   * insecure context. Left unhandled that is an uncaught rejection and a button that
   * silently does nothing, so failures fall back to the legacy path.
   */
  const copyLink = async () => {
    if (!href) return
    const url = new URL(href, window.location.origin).toString()

    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const field = document.createElement('textarea')
      field.value = url
      field.setAttribute('readonly', '')
      field.style.position = 'fixed'
      field.style.opacity = '0'
      document.body.appendChild(field)
      field.select()
      const copiedViaFallback = document.execCommand('copy')
      document.body.removeChild(field)
      if (!copiedViaFallback) return
    }

    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <Actions>
      {href && (
        <ActionLink
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${title}`}
          title="Open"
        >
          <ArrowUpRight size={ACTION_ICON_SIZE} />
        </ActionLink>
      )}
      {href && (
        <ActionButton
          type="button"
          onClick={copyLink}
          aria-label={`Copy link to ${title}`}
          title={copied ? 'Copied' : 'Copy link'}
        >
          {copied ? <Check size={ACTION_ICON_SIZE} /> : <Send size={ACTION_ICON_SIZE} />}
        </ActionButton>
      )}
      {repo && (
        <ActionLink
          $end
          href={`https://github.com/${repo}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View source for ${title}`}
          title="Source"
        >
          <BrandIcon name="github" size={ACTION_ICON_SIZE} />
        </ActionLink>
      )}
    </Actions>
  )
}
