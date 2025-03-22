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
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{attachment.file_name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(attachment.file_size)} •
                {formatDate(attachment.uploaded_at)}
              </p>
            </div>
            {attachment.file_url && (
              <>
                <a
                  href={attachment.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Open in new tab"
                >
                  <ExternalLinkIcon className="h-4 w-4" />
                </a>
                <a
                  href={`${API_BASE_URL}/tasks/${taskId}/attachments/${attachment.id}/download`}
                  className="p-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity ml-1"
                  title="Download"
                  onClick={async (e) => {
                    e.preventDefault()

                    try {
                      // Fetch the download endpoint
                      const response = await fetch(`${API_BASE_URL}/tasks/${taskId}/attachments/${attachment.id}/download`, {
                        headers: {
                          'Authorization': `Bearer ${localStorage.getItem('token')}`
                        }
                      })

                      if (!response.ok) {
                        throw new Error('Failed to download attachment')
                      }

                      // Check if the response is JSON (Azure URL) or a file
                      const contentType = response.headers.get('content-type')
                      if (contentType && contentType.includes('application/json')) {
                        // It's an Azure URL, so get the URL and redirect
                        const data = await response.json()
                        window.open(data.url, '_blank')
                      } else {
                        // It's a direct file download, trigger browser download
                        const blob = await response.blob()
                        const url = window.URL.createObjectURL(blob)
                        const a = document.createElement('a')
                        a.href = url
                        a.download = attachment.file_name
                        document.body.appendChild(a)
                        a.click()
                        window.URL.revokeObjectURL(url)
                        a.remove()
                      }
                    } catch (error) {
                      console.error('Error downloading attachment:', error)
                    }
                  }}
                >
                  <DownloadIcon className="h-4 w-4" />
                </a>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default TaskAttachments 