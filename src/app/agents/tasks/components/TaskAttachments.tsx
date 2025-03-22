import React from 'react'
import { PaperclipIcon, ExternalLinkIcon, DownloadIcon } from 'lucide-react'
import { TaskAttachment } from '@/services/tasks'
import { API_BASE_URL } from '@/config'

interface TaskAttachmentsProps {
  attachments: TaskAttachment[] | undefined
  taskId: string
}

const TaskAttachments = ({ attachments, taskId }: TaskAttachmentsProps) => {
  if (!attachments || attachments.length === 0) {
    return null
  }

  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B'
    else if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
    else return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
  }

  // Format date
  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  // Function to handle attachment download/open
  const handleAttachment = async (attachment: TaskAttachment, openInNewTab: boolean = false) => {
    try {
      // Always fetch the URL through the API to ensure proper authentication and get time-limited access
      const token = localStorage.getItem('accessToken')
      if (!token) {
        console.error('Authentication token not found')
        return
      }

      const response = await fetch(
        `${API_BASE_URL}/tasks/${taskId}/attachments/${attachment.id}/download`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      if (!response.ok) {
        throw new Error('Failed to download attachment')
      }

      // Check if the response is JSON (Azure URL) or a file
      const contentType = response.headers.get('content-type')
      if (contentType && contentType.includes('application/json')) {
        // It's an Azure URL with SAS token
        const data = await response.json()
        if (openInNewTab) {
          // Open in new tab if requested
          window.open(data.url, '_blank')
        } else {
          // Download file from the SAS URL
          const fileResponse = await fetch(data.url)
          const blob = await fileResponse.blob()
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = attachment.file_name
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          a.remove()
        }
      } else {
        // It's a direct file download from the API
        const blob = await response.blob()
        if (openInNewTab) {
          // For local files, create an object URL and open in new tab
          const url = window.URL.createObjectURL(blob)
          window.open(url, '_blank')
          // Clean up after a delay
          setTimeout(() => window.URL.revokeObjectURL(url), 5000)
        } else {
          // Download the file
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = attachment.file_name
          document.body.appendChild(a)
          a.click()
          window.URL.revokeObjectURL(url)
          a.remove()
        }
      }
    } catch (error) {
      console.error('Error accessing attachment:', error)
    }
  }

  return (
    <div className="space-y-2 mt-4">
      <h3 className="text-sm font-medium">Attachments ({attachments.length})</h3>
      <div className="space-y-2">
        {attachments.map((attachment) => (
          <div
            key={attachment.id}
            className="flex items-center p-2 border rounded-md group hover:bg-muted/50"
          >
            <PaperclipIcon className="h-4 w-4 mr-2 text-muted-foreground" />
            <div className="flex-1 min-w-0 cursor-pointer" onClick={() => handleAttachment(attachment, true)}>
              <p className="text-sm font-medium truncate">{attachment.file_name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(attachment.file_size)} •
                {formatDate(attachment.uploaded_at)}
              </p>
            </div>
            <button
              className="p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
              title="Open in new tab"
              onClick={() => handleAttachment(attachment, true)}
            >
              <ExternalLinkIcon className="h-4 w-4" />
            </button>
            <button
              className="p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity ml-1"
              title="Download"
              onClick={() => handleAttachment(attachment, false)}
            >
              <DownloadIcon className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TaskAttachments 