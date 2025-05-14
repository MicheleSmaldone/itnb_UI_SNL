"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { MessageSquare, BarChart, LogOut, PlusCircle, Trash2, Edit, MoreVertical } from "lucide-react"
import { ChatInterface } from "@/components/chat/chat-interface"
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard"
import { ThemeToggle } from "@/components/theme-toggle"
import { useTheme } from "next-themes"
import Image from "next/image"
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"

// Define chat type
interface Chat {
  id: string;
  title: string;
  createdAt: string;
  lastUpdated?: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<"chat" | "analytics">("chat")
  const [chats, setChats] = useState<Chat[]>([])
  const [activeChatId, setActiveChatId] = useState<string | null>(null)
  const [isRenameDialogOpen, setIsRenameDialogOpen] = useState(false)
  const [chatToRename, setChatToRename] = useState<Chat | null>(null)
  const [newChatTitle, setNewChatTitle] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [chatToDelete, setChatToDelete] = useState<Chat | null>(null)
  const router = useRouter()
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Check authentication on mount and load chats
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn")
    if (!isLoggedIn) {
      router.push("/login")
      return
    }
    
    // Load saved chats from localStorage
    const savedChats = localStorage.getItem("savedChats")
    if (savedChats) {
      try {
        const parsedChats = JSON.parse(savedChats) as Chat[]
        setChats(parsedChats)
        
        // Set active chat to the most recent one if it exists
        if (parsedChats.length > 0) {
          setActiveChatId(parsedChats[0].id)
        } else {
          // Create a default chat if none exist
          handleNewChat()
        }
      } catch (error) {
        console.error('Error parsing saved chats:', error)
        handleNewChat()
      }
    } else {
      // Create a default chat if none exist
      handleNewChat()
    }
    
    setMounted(true)
  }, [router])

  // Save chats whenever they change
  useEffect(() => {
    if (mounted && chats.length > 0) {
      localStorage.setItem("savedChats", JSON.stringify(chats))
    }
  }, [chats, mounted])

  const handleLogout = () => {
    // Clear both localStorage and cookies
    localStorage.removeItem("isLoggedIn")
    // Don't clear chat messages on logout to preserve them for next login
    document.cookie = "isLoggedIn=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT"
    router.refresh()
    router.push("/login")
  }

  const handleNewChat = () => {
    // Generate a unique ID for the new chat
    const newChatId = Date.now().toString()
    
    // Create a new chat
    const newChat: Chat = {
      id: newChatId,
      title: `New Chat`,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    }
    
    // Add the new chat to the beginning of the list
    setChats(prevChats => [newChat, ...prevChats])
    
    // Set the new chat as active
    setActiveChatId(newChatId)
    
    // Switch to chat tab if not already there
    setActiveTab("chat")
  }

  const handleSelectChat = (chatId: string) => {
    setActiveChatId(chatId)
    setActiveTab("chat")
  }

  const handleOpenRenameDialog = (chat: Chat) => {
    setChatToRename(chat)
    setNewChatTitle(chat.title)
    setIsRenameDialogOpen(true)
  }

  const handleRenameChat = () => {
    if (!chatToRename || !newChatTitle.trim()) return
    
    setChats(prevChats => 
      prevChats.map(chat => 
        chat.id === chatToRename.id 
          ? { ...chat, title: newChatTitle.trim(), lastUpdated: new Date().toISOString() } 
          : chat
      )
    )
    
    setIsRenameDialogOpen(false)
    setChatToRename(null)
    setNewChatTitle("")
  }

  const handleOpenDeleteDialog = (chat: Chat) => {
    setChatToDelete(chat)
    setIsDeleteDialogOpen(true)
  }

  const handleDeleteChat = () => {
    if (!chatToDelete) return
    
    // Remove the chat from the list
    setChats(prevChats => prevChats.filter(chat => chat.id !== chatToDelete.id))
    
    // If the deleted chat was active, set the first chat as active
    if (activeChatId === chatToDelete.id) {
      const remainingChats = chats.filter(chat => chat.id !== chatToDelete.id)
      if (remainingChats.length > 0) {
        setActiveChatId(remainingChats[0].id)
      } else {
        // If no chats remain, create a new one
        handleNewChat()
      }
    }
    
    // Remove chat messages from localStorage
    const chatStorageKey = `chat_${chatToDelete.id}`
    localStorage.removeItem(chatStorageKey)
    
    setIsDeleteDialogOpen(false)
    setChatToDelete(null)
  }

  // Format date for display in sidebar
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
  }

  return (
    <SidebarProvider defaultOpen>
      <div className="flex h-screen flex-col bg-[#f5f5f5] dark:bg-[#031440]">
        {/* Top Navigation Bar */}
        <nav className="flex h-16 items-center justify-between bg-[#f5f5f5] dark:bg-[#031440] px-6 flex-shrink-0">
          <div className="flex flex-col">
            <div className="w-32 h-auto">
              {mounted && (
                <Image 
                  src={theme === "dark" ? "/white_logo_itnb.png" : "/itnb_LOGO.png"}
                  alt="itnb ag logo" 
                  width={128} 
                  height={64}
                  priority
                />
              )}
            </div>
          
          </div>
          <div className="flex items-center gap-4">
            <button className="font-montserrat text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white">
              Manager Account
            </button>
            <ThemeToggle />
            <button 
              onClick={handleLogout}
              className="text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-white transition-colors"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </nav>

        {/* Main Content */}
        <div className="flex flex-1 overflow-hidden">
          <Sidebar className="bg-gray-300 dark:bg-[#02102e] flex-shrink-0 shadow-md my-4">
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={handleNewChat}
                    icon={<PlusCircle className="h-5 w-5" />}
                    label="New Chat"
                    className="py-2"
                    labelClassName="text-sm font-medium"
                  />
                </SidebarMenuItem>
                
                {/* Separator */}
                <div className="my-2 border-t border-gray-400/30 dark:border-gray-600/30"></div>
                
                {/* Render chat list */}
                {chats.map(chat => (
                  <SidebarMenuItem key={chat.id}>
                    <div className="flex items-center w-full">
                      <SidebarMenuButton
                        onClick={() => handleSelectChat(chat.id)}
                        isActive={activeChatId === chat.id && activeTab === "chat"}
                        label={chat.title}
                        secondaryLabel={formatDate(chat.lastUpdated || chat.createdAt)}
                        className="flex-grow py-1.5"
                        labelClassName="text-xs font-medium text-gray-700 dark:text-gray-300"
                      />
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="h-6 w-6 p-0 ml-1"
                            onMouseEnter={(e) => {
                              // Prevent event from bubbling up to parent elements
                              e.stopPropagation();
                            }}
                            onClick={(e) => {
                              // Prevent event from bubbling up to parent elements
                              e.stopPropagation();
                            }}
                          >
                            <MoreVertical className="h-3 w-3" />
                            <span className="sr-only">More</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent 
                          align="end"
                          onMouseEnter={(e) => e.stopPropagation()}
                          onMouseLeave={(e) => e.stopPropagation()}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenRenameDialog(chat);
                            }}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Rename</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenDeleteDialog(chat);
                            }}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </SidebarMenuItem>
                ))}
                
                {/* Separator */}
                <div className="my-2 border-t border-gray-400/30 dark:border-gray-600/30"></div>
                
                <SidebarMenuItem>
                  <SidebarMenuButton
                    onClick={() => setActiveTab("analytics")}
                    isActive={activeTab === "analytics"}
                    icon={<BarChart className="h-5 w-5" />}
                    label="Analytics Dashboard"
                    className="py-2"
                    labelClassName="text-sm font-medium"
                  />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>

          <main className="flex-1 overflow-hidden">
            <div className="h-full overflow-auto">
              {activeTab === "chat" ? (
                <ChatInterface chatId={activeChatId} />
              ) : (
                <AnalyticsDashboard />
              )}
            </div>
          </main>
        </div>
      </div>

      {/* Rename Chat Dialog */}
      <Dialog open={isRenameDialogOpen} onOpenChange={setIsRenameDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Chat</DialogTitle>
          </DialogHeader>
          <Input
            value={newChatTitle}
            onChange={(e) => setNewChatTitle(e.target.value)}
            placeholder="Enter new chat title"
            className="mt-4"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsRenameDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleRenameChat}>
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Chat Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Chat</DialogTitle>
          </DialogHeader>
          <p className="py-4">
            Are you sure you want to delete this chat? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeleteChat}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  )
} 