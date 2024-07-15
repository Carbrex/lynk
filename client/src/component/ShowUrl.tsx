import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { EditUrlProps } from "../types";
import QRCodeComponent from "./QRCode";
import { deleteShortUrl } from "../api";

interface ExtendedEditUrlProps extends EditUrlProps {
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

function ShowUrl({
  _id,
  editUrl,
  setEditUrl,
  loadDashboard,
  setIsEditing,
  urlData,
}: ExtendedEditUrlProps) {
  const [withPassword, setWithPassword] = useState(false);
  const [shortenUrl, setShortenUrl] = useState(
    window.location.origin + "/" + urlData?.shortUrl,
  );

  useEffect(() => {
    if (urlData?.password) {
      const remaining = `?password=${urlData.password}`;
      if (withPassword) {
        setShortenUrl((prev) => prev + remaining);
      } else {
        setShortenUrl((prev) => prev.replace(remaining, ""));
      }
    }
  }, [withPassword]);

  if (!urlData) return <></>;
  return (
    <>
      <div
        className={`${!editUrl && "hidden"} fixed top-0 left-0 min-w-full min-h-screen flex items-center justify-center z-20`}
        style={{
          backdropFilter: editUrl ? "blur(8px)" : "none", // Apply blur effect conditionally
          backgroundColor: editUrl ? "rgba(0, 0, 0, 0.5)" : "transparent", // Add a semi-transparent background
        }}
      >
        <div
          id="crud-modal"
          tabIndex={-1}
          aria-hidden="true"
          className={`${!editUrl && "hidden"} overflow-y-auto overflow-x-hidden justify-center items-center md:inset-0 max-h-full`}
        >
          <div className="relative p-4 w-[95vw] max-w-xl max-h-full flex flex-col">
            <div className="bg-white rounded-lg shadow dark:bg-gray-700 min-h-[80vh]">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  URL Details
                </h3>
                <button
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                  data-modal-toggle="crud-modal"
                  onClick={() => setEditUrl((prev: boolean) => !prev)}
                >
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 14 14"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                    />
                  </svg>
                  <span className="sr-only">Close modal</span>
                </button>
              </div>
              <div className="p-4 md:p-5 flex-grow min-h-[70vh] flex flex-col justify-between">
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Original URL
                    </label>
                    <input
                      type="text"
                      name="originalUrl"
                      id="originalUrl"
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Enter original URL"
                      value={urlData.originalUrl}
                      disabled
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <div className="mt-3 mb-[-1.5rem]">
                      <label
                        htmlFor="short-url"
                        className="text-sm text-left font-medium text-gray-900 dark:text-white mb-2 block"
                      >
                        Shortened URL:
                      </label>
                      <div className="relative mb-4">
                        <input
                          id="short-url"
                          type="text"
                          className={`bg-gray-50 dark:bg-gray-600 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-500 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:placeholder-gray-400`}
                          value={shortenUrl}
                          disabled
                          readOnly
                        />
                        <button
                          data-copy-to-clipboard-target="shorten-url"
                          data-tooltip-target="tooltip-shorten-url"
                          className="absolute end-2 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg p-2 inline-flex items-center justify-center"
                          onClick={() => {
                            navigator.clipboard.writeText(shortenUrl);
                            const tooltip = document.getElementById(
                              "default-icon-shorten-url",
                            );
                            const successIcon = document.getElementById(
                              "success-icon-shorten-url",
                            );
                            toast.success("Copied to clipboard");
                            tooltip?.classList.add("hidden");
                            successIcon?.classList.remove("hidden");
                            setTimeout(() => {
                              tooltip?.classList.remove("hidden");
                              successIcon?.classList.add("hidden");
                            }, 2000);
                          }}
                        >
                          <span id="default-icon-shorten-url">
                            <svg
                              className="w-3.5 h-3.5"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="currentColor"
                              viewBox="0 0 18 20"
                            >
                              <path d="M16 1h-3.278A1.992 1.992 0 0 0 11 0H7a1.993 1.993 0 0 0-1.722 1H2a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V3a2 2 0 0 0-2-2Zm-3 14H5a1 1 0 0 1 0-2h8a1 1 0 0 1 0 2Zm0-4H5a1 1 0 0 1 0-2h8a1 1 0 1 1 0 2Zm0-5H5a1 1 0 0 1 0-2h2V2h4v2h2a1 1 0 1 1 0 2Z" />
                            </svg>
                          </span>
                          <span
                            id="success-icon-shorten-url"
                            className="hidden inline-flex items-center"
                          >
                            <svg
                              className="w-3.5 h-3.5 text-blue-700 dark:text-blue-500"
                              aria-hidden="true"
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 16 12"
                            >
                              <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M1 5.917 5.724 10.5 15 1.5"
                              />
                            </svg>
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                  {urlData.password && (
                    <div className="col-span-4 sm:col-span-2">
                      <div className="flex items-center">
                        <input
                          id="with-password"
                          type="checkbox"
                          className="rounded text-primary-600 focus:ring-primary-600 dark:focus:ring-primary-500"
                          checked={withPassword}
                          onChange={() => setWithPassword((prev) => !prev)}
                        />
                        <label
                          htmlFor="with-password"
                          className="ml-2 text-sm text-gray-900 dark:text-white"
                        >
                          Include Password in URL
                        </label>
                      </div>
                    </div>
                  )}
                  <div>
                    <p>
                      <span className="inline mb-2 mr-2 text-sm font-medium text-gray-900 dark:text-white">
                        Clicks:
                      </span>
                      {urlData.clickCount}
                    </p>
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <p>
                      <span className="inline mb-2 mr-2 text-sm font-medium text-gray-900 dark:text-white">
                        Expiration Date:
                      </span>
                      {urlData.hasExpirationDate ? (
                        <time>{`${new Date(urlData.expirationDate).toLocaleString()}`}</time>
                      ) : (
                        "Never"
                      )}
                    </p>
                  </div>

                  {urlData.password && (
                    <div className="col-span-4 sm:col-span-2">
                      <label
                        htmlFor="password"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Password
                      </label>
                      <input
                        type="text"
                        name="password"
                        id="password"
                        className={`bg-gray-50 dark:bg-gray-600 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                        value={urlData.password}
                        disabled
                      />
                    </div>
                  )}
                  <QRCodeComponent link={shortenUrl} />
                </div>

                <div className="flex gap-2">
                  <button
                    className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-fit p-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={() => {
                      setIsEditing(true);
                    }}
                  >
                    <svg
                      className="w-[0.875rem] h-[0.875rem] mr-[0.25rem] my-0"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M20.8477 1.87868C19.6761 0.707109 17.7766 0.707105 16.605 1.87868L2.44744 16.0363C2.02864 16.4551 1.74317 16.9885 1.62702 17.5692L1.03995 20.5046C0.760062 21.904 1.9939 23.1379 3.39334 22.858L6.32868 22.2709C6.90945 22.1548 7.44285 21.8693 7.86165 21.4505L22.0192 7.29289C23.1908 6.12132 23.1908 4.22183 22.0192 3.05025L20.8477 1.87868ZM18.0192 3.29289C18.4098 2.90237 19.0429 2.90237 19.4335 3.29289L20.605 4.46447C20.9956 4.85499 20.9956 5.48815 20.605 5.87868L17.9334 8.55027L15.3477 5.96448L18.0192 3.29289ZM13.9334 7.3787L3.86165 17.4505C3.72205 17.5901 3.6269 17.7679 3.58818 17.9615L3.00111 20.8968L5.93645 20.3097C6.13004 20.271 6.30784 20.1759 6.44744 20.0363L16.5192 9.96448L13.9334 7.3787Z"
                        fill="currentColor"
                      />
                    </svg>
                    Edit
                  </button>
                  <button
                    className="text-white inline-flex items-center bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm w-fit p-2.5 text-center dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-800"
                    onClick={() =>
                      deleteShortUrl(_id).then(() => {
                        loadDashboard();
                        setIsEditing(false);
                      })
                    }
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      className="w-5 h-5"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M10 12V17"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M14 12V17"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M4 7H20"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M6 10V18C6 19.6569 7.34315 21 9 21H15C16.6569 21 18 19.6569 18 18V10"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ShowUrl;
