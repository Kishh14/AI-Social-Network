import React, { LegacyRef, useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import { FaMagic } from "react-icons/fa";

import { trpc } from "../../../lib/trpc";
import { useSelector } from "react-redux";
import { Store } from "../../../types";
import axios, { AxiosError } from "axios"
import { toast } from "react-toastify";
import { useClickAway } from "../../../hooks/useClickAway";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const placeholder = "What are you thinking right now?"

export default function NewPost() {
  const [postContent, setPostContent] = useState(placeholder);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [promptInput, setPromptInput] = useState("");
  const [modalPostImgUrl, setModalPostImgUrl] = useState("");
  const [modalPostVideoUrl, setModalPostVideoUrl] = useState("");
  const [modalPostContent, setModalPostContent] = useState("");
  const [modalMediaCaption, setModalMediaCaption] = useState("");
  const [postImgUrl, setPostImgUrl] = useState("");
  const [postVideoUrl, setPostVideoUrl] = useState("");
  const [activeAIMode, setActiveAIMode] = useState<"" | "video" | "image">("");
  const userId = useSelector<Store, string>(state => state.user.user.details._id);
  const isModalPreviewOpen = useMemo(() => {
    return !!modalPostContent || !!modalPostImgUrl || !!modalPostVideoUrl
  }, [modalPostContent, modalPostImgUrl, modalPostVideoUrl]);
  const queryClient = useQueryClient();
  const { isLoading, mutate } = trpc.posts.createPost.useMutation({
    onSuccess() {
      queryClient.invalidateQueries(["posts"]);
      toast.success("Posted successfully");
    },
    onError(e) {
      toast.error(e.message);
    },
    onSettled() {
      setPostContent(placeholder)
    }
  });
  useEffect(() => {
    if (/image/i.test(promptInput)) {
      setActiveAIMode("image")
    } else if (/video/i.test(promptInput)) {
      setActiveAIMode("video")
    } else {
      setActiveAIMode("")
    }
  }, [promptInput])
  const { isLoading: isAIImageLoading, mutate: sendAIImageRequest } = useMutation(async () => {
    try {
      const resp = await axios.post("http://localhost:3000/generate-image", { imagePrompt: promptInput });
      if (!resp.data) {
        throw new Error('Something went wrong!');
      }
      if (modalPostVideoUrl) {
        setModalPostVideoUrl("");
      }
      setModalPostImgUrl(resp.data.imageUrl as string);
    } catch (e) {
      if (e instanceof AxiosError) {
        throw new Error(e.message);
      }
      throw new Error('Something went wrong!');
    }
  })
  const { isLoading: isAIVideoLoading, mutate: sendAIVideoRequest } = useMutation(async () => {
    try {
      const resp = await axios.post("http://localhost:3000/generate-video", { videoPrompt: promptInput });
      if (!resp.data) {
        throw new Error('Something went wrong!');
      }
      if (modalPostImgUrl) {
        setModalPostImgUrl("");
      }
      setModalPostVideoUrl(resp.data.videoURL as string);
    } catch (e) {
      if (e instanceof AxiosError) {
        throw new Error(e.message);
      }
      throw new Error('Something went wrong!');
    }
  })
  const { isLoading: isAICaptionLoading, mutate: sendAICaptionRequest } = useMutation(async () => {
    try {
      const resp = await axios.post("http://localhost:3000/generate-caption", { image: modalPostImgUrl });
      if (!resp.data) {
        throw new Error('Something went wrong!');
      }
      setModalPostContent(resp.data)
    } catch (e) {
      if (e instanceof AxiosError) {
        throw new Error(e.message);
      }
      throw new Error('Something went wrong!');
    }
  })
  const { isLoading: isAITextLoading, mutate: sendAITextRequest } = useMutation(async () => {
    try {
      const resp = await axios.post("http://localhost:3000/generate-text", { text: promptInput });
      if (!resp.data) {
        throw new Error('Something went wrong!');
      }
      setModalPostContent(resp.data)
    } catch (e) {
      if (e instanceof AxiosError) {
        throw new Error(e.message);
      }
      throw new Error('Something went wrong!');
    }
  })
  const sendAIRequest = () => {
    if (activeAIMode == "image") {
      sendAIImageRequest();
    } else if (activeAIMode == "video") {
      sendAIVideoRequest();
    } else {
      sendAITextRequest()
    }
  }
  const promptInputRef = useRef<HTMLInputElement>(null);
  const modalRef = useClickAway(() => {
    if (!isAIImageLoading) {
      setModalMediaCaption("")
      setModalPostImgUrl("");
      setModalPostVideoUrl("");
      setActiveAIMode("")
      setIsModalOpen(false);
    }
  })
  const saveAIPrompt = () => {

    if (modalPostImgUrl) {
      setPostImgUrl(modalPostImgUrl)
      setPostVideoUrl("")
    }
    if (modalPostVideoUrl) {
      setPostVideoUrl(modalPostVideoUrl)
      setPostImgUrl("")
    }
    if (modalMediaCaption) {
      setPostContent(prev => {
        prev = (prev == placeholder) ? modalPostContent : prev + "\n" + modalPostContent;
        return (prev == placeholder) ? modalMediaCaption : prev + "\n" + modalMediaCaption
      }
      );
    }
    setModalMediaCaption("");
    setModalPostImgUrl("");
    setModalPostVideoUrl("");
    setActiveAIMode("");
    setIsModalOpen(false);
  }

  function createPost(e: React.FormEvent) {
    e.preventDefault();
    mutate({ userId, content: postContent, imageUrl: postImgUrl, videoUrl: postVideoUrl });
  }

  useEffect(() => {
    if (isModalOpen) {
      promptInputRef.current?.focus();
    }
  }, [isModalOpen])

  if (!userId) return

  return (
    <div className="py-4 my-3 glass-effect mx-3 rounded-md">
      <form onSubmit={createPost} className="ml-10">
        <h1></h1>
        <textarea
          rows={5}
          value={postContent}
          onChange={e => {
            setPostContent(e.target.value)
          }}
          onBlur={e => {
            if (postContent == "") {
              setPostContent(placeholder)
            }
          }}
          onFocus={e => {
            if (e.target.value == placeholder) {
              setPostContent("")
            }
          }}
          onKeyDown={e => {
            if (e.ctrlKey && e.code == "Space") {
              setIsModalOpen(true);
              console.log("AI is here!")
            }
          }}
          className={
            clsx("w-[60%] p-2 resize-none text-white bg-transparent border outline-purple-600 rounded-md border-gray-400", {
              "!text-gray-400": postContent == placeholder
            })}
        >
        </textarea>
        <br />
        {postImgUrl && <img
          className="mt-1 h-36 rounded-md"
          src={postImgUrl}
          alt="Post"
        />}
        {postVideoUrl && (
          <video width="320" height="240" autoPlay>
            <source src={postVideoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        {postContent != placeholder ?
          <p className="text-gray-500 dark:text-gray-400 my-2 transition-all duration-300">
            Press <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">Ctrl</kbd> + <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">Space</kbd> to open AI.
          </p> : null
        }
        <button type="submit" disabled={isLoading} className="text-white mt-2 bg-blue-500 rounded py-1 px-3 p-1">
          {isLoading ? "Posting..." : "Post"}
        </button>
      </form>
      {isModalOpen ?
        <div
          ref={modalRef as LegacyRef<HTMLDivElement>}
          className="p-4 z-40 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 min-h-[70vh] rounded-md shadow-lg w-1/2 overflow-y-auto overflow-x-hidden no-scrollbar"
          style={{
            backdropFilter: "blur(50px)",
            background: "rgba(000,000,000)",
          }}
        >
          <div className="">
            <div className="flex">

              <input
                value={promptInput}
                onChange={e => setPromptInput(e.target.value)}
                disabled={isAIImageLoading}
                ref={promptInputRef}
                onKeyDown={(e) => {
                  if (e.key == "Enter") {
                    sendAIRequest();
                  }
                }}
                placeholder="Ask something..."
                className="w-full border text-white h-10 px-2 rounded-tl-md rounded-bl-md bg-[#1E293B] outline-none" type="text" />
              {
                (isAIImageLoading || isAIVideoLoading || isAITextLoading) ?

                  <div role="status" className="bg-[#1E293B] grid place-content-center size-10 rounded-tr-md rounded-br-md border-y border-r">
                    <svg
                      aria-hidden="true"
                      className="size-6 animate-spin fill-gray-300"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                  </div> :
                  <FaMagic className="bg-[#1E293B] rounded-tr-md rounded-br-md border-y border-r size-10 p-2.5 font-lg text-white" />
              }
            </div>

          </div>
          <div className="flex my-2 text-sm gap-2">
            <button
              data-active={activeAIMode == "image"}
              onClick={() => {
                if (!(/image/i.test(promptInput))) {
                  if ((/video/i.test(promptInput))) {
                    setPromptInput(prev => prev.replace(/video/i, "image"))
                  } else {
                    setPromptInput(prev => "An Image in which " + prev)
                  }
                }
              }}
              className="bg-zinc-700 data-[active='true']:bg-purple-500 transition-all duration-200 rounded-md hover:bg-zinc-950 text-zinc-100 px-2 py-1"
            >Image</button>
            <button
              data-active={activeAIMode == "video"}
              onClick={() => {
                if (!(/video/i.test(promptInput))) {
                  if ((/image/i.test(promptInput))) {
                    setPromptInput(prev => prev.replace(/image/i, "video"))
                  } else {
                    setPromptInput(prev => "An Video in which " + prev)
                  }
                }
              }}
              className="bg-zinc-700 data-[active='true']:bg-purple-500 transition-all duration-100 rounded-md hover:bg-zinc-950 text-zinc-100 px-2 py-1"
            >Video</button>
          </div>
          {
            isModalPreviewOpen &&
            <div className="px-4 pb-1 border-l border-gray-400 my-8 ml-10">
              {modalPostContent &&
                <p className="font-semibold text-white">{modalPostContent}</p>
              }
              {modalMediaCaption &&
                <p className="font-semibold text-white">{modalMediaCaption}</p>
              }
              {modalPostVideoUrl && (
                <video width="320" height="240" className="mt-2" autoPlay>
                  <source src={modalPostVideoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
              {modalPostImgUrl &&
                <img
                  className="mt-3 rounded-md"
                  src={modalPostImgUrl}
                  alt="Post"
                  style={{ width: "400px", height: "350px", objectFit: "cover" }}
                />
              }
              {
                modalPostImgUrl &&
                <button onClick={() => {
                  sendAICaptionRequest()
                }} className="flex gap-2 px-3 mt-3 rounded-md hover:bg-purple-600 py-2 bg-purple-500"
                >{isAICaptionLoading ? "Generating..." : "Generate Caption"} <FaMagic />
                </button>
              }
            </div>
          }
          <div className="w-full flex justify-between">
            <span></span>
            <button onClick={saveAIPrompt} className="mt-3 px-3 rounded-md hover:bg-purple-600 py-2 bg-purple-500">Save</button>
          </div>
        </div>
        : null}
    </div>
  )
}