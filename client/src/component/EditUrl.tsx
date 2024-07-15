import React from "react";
import { toast } from "react-toastify";
import { editShortUrl } from "../api";
import { EditUrlData, EditUrlProps } from "../types";

interface ExtendedEditUrlProps extends EditUrlProps {
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
}

function EditUrl({
  _id,
  editUrl,
  setEditUrl,
  loadDashboard,
  setIsEditing,
  urlData,
}: ExtendedEditUrlProps) {
  const [shortenUrlData, setShortenUrlData] = React.useState<EditUrlData>({
    ...urlData,
    expirationDate: new Date(urlData.expirationDate),
    hasPassword: urlData.password ? true : false,
  });
  const [alreadyShortening, setAlreadyShortening] = React.useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (alreadyShortening) return;
    setAlreadyShortening(true);

    if (shortenUrlData.hasPassword && !shortenUrlData.password) {
      toast.error("Please enter a password or disable password protection");
      setAlreadyShortening(false);
      return;
    }
    if (
      shortenUrlData.hasExpirationDate &&
      shortenUrlData.expirationDate < new Date()
    ) {
      toast.error("Please enter a valid future date for expiration");
      setAlreadyShortening(false);
      return;
    }
    try {
      const editPromise = editShortUrl(_id, shortenUrlData);
      const combinedPromise = editPromise.then(async (response: any) => {
        if (!response.error) {
          await loadDashboard(false);
        }
        return response;
      });
      toast.promise(combinedPromise, {
        pending: "Editing URL...",
        success: "URL edited successfully",
        error: "Error editing URL",
      });
      const response: any = await combinedPromise;
      if (response.error) {
        console.log(response.error);
      } else {
        console.log(response.data);
        setIsEditing(false);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setAlreadyShortening(false);
    }
  };

  if (!urlData) return <></>;

  return (
    <>
      <div
        className={`${!editUrl && "hidden"} fixed top-0 left-0 w-screen h-screen flex items-center justify-center z-20`}
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
                  Editing
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
              <form
                className="p-4 md:p-5 flex-grow min-h-[70vh] flex flex-col justify-between"
                onSubmit={handleSubmit}
              >
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Original URL (Cannot be changed)
                    </label>
                    <input
                      type="text"
                      name="originalUrl"
                      id="originalUrl"
                      className="bg-gray-200 dark:bg-gray-500 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      placeholder="Enter original URL"
                      value={shortenUrlData.originalUrl}
                      disabled
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-2">
                    <label
                      htmlFor="shortUrl"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Short URL (Cannot be changed)
                    </label>
                    <input
                      type="string"
                      name="shortUrl"
                      id="shortUrl"
                      className={`"bg-gray-200 dark:bg-gray-500 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-500 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 dark:placeholder-gray-400`}
                      value={shortenUrlData.shortUrl}
                      disabled
                    />
                  </div>
                  <div className="col-span-4 sm:col-span-2 flex items-center">
                    <label
                      htmlFor="hasExpirationDate"
                      className="text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Set Expiration Date
                    </label>
                    <input
                      type="checkbox"
                      name="hasExpirationDate"
                      id="hasExpirationDate"
                      className="h-4 w-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 m-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      onChange={(e) => {
                        setShortenUrlData((prev) => ({
                          ...prev,
                          hasExpirationDate: e.target.checked,
                        }));
                      }}
                      checked={shortenUrlData.hasExpirationDate}
                    />
                  </div>
                  {shortenUrlData.hasExpirationDate && (
                    <div className="col-span-2 sm:col-span-1">
                      <label
                        htmlFor="expirationDate"
                        className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                      >
                        Expiration Date
                      </label>
                      <input
                        type="date"
                        name="expirationDate"
                        id="expirationDate"
                        className={`${shortenUrlData.hasExpirationDate ? "bg-gray-50 dark:bg-gray-600" : "bg-gray-200 dark:bg-gray-500"}  border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                        onChange={(e) => {
                          setShortenUrlData((prev) => ({
                            ...prev,
                            expirationDate: new Date(e.target.value),
                          }));
                        }}
                        value={
                          shortenUrlData.expirationDate
                            .toISOString()
                            .split("T")[0]
                        }
                        disabled={!shortenUrlData.hasExpirationDate}
                        min={new Date().toISOString().split("T")[0]}
                        max={
                          new Date(
                            new Date().getTime() + 1000 * 60 * 60 * 24 * 365
                          )
                            .toISOString()
                            .split("T")[0]
                        }
                      />
                    </div>
                  )}

                  <div className="col-span-4 sm:col-span-2 flex items-center">
                    <label
                      htmlFor="hasPassword"
                      className="text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Set Password
                    </label>
                    <input
                      type="checkbox"
                      name="hasPassword"
                      id="hasPassword"
                      className="h-4 w-4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 m-2 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                      onChange={(e) => {
                        setShortenUrlData((prev) => ({
                          ...prev,
                          hasPassword: e.target.checked,
                        }));
                      }}
                      checked={shortenUrlData.hasPassword}
                    />
                  </div>

                  {shortenUrlData.hasPassword && (
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
                        className={`${shortenUrlData.hasPassword ? "bg-gray-50 dark:bg-gray-600" : "bg-gray-200 dark:bg-gray-500"} border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500`}
                        onChange={(e) => {
                          setShortenUrlData((prev) => ({
                            ...prev,
                            password: e.target.value,
                          }));
                        }}
                        value={shortenUrlData.password}
                        minLength={4}
                        maxLength={20}
                        disabled={!shortenUrlData.hasPassword}
                      />
                    </div>
                  )}
                </div>
                <div className="flex gap-4">
                  <button
                    type="submit"
                    className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-fit p-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
                        d="M18.1716 1C18.702 1 19.2107 1.21071 19.5858 1.58579L22.4142 4.41421C22.7893 4.78929 23 5.29799 23 5.82843V20C23 21.6569 21.6569 23 20 23H4C2.34315 23 1 21.6569 1 20V4C1 2.34315 2.34315 1 4 1H18.1716ZM4 3C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21L5 21L5 15C5 13.3431 6.34315 12 8 12L16 12C17.6569 12 19 13.3431 19 15V21H20C20.5523 21 21 20.5523 21 20V6.82843C21 6.29799 20.7893 5.78929 20.4142 5.41421L18.5858 3.58579C18.2107 3.21071 17.702 3 17.1716 3H17V5C17 6.65685 15.6569 8 14 8H10C8.34315 8 7 6.65685 7 5V3H4ZM17 21V15C17 14.4477 16.5523 14 16 14L8 14C7.44772 14 7 14.4477 7 15L7 21L17 21ZM9 3H15V5C15 5.55228 14.5523 6 14 6H10C9.44772 6 9 5.55228 9 5V3Z"
                        fill="currentColor"
                      />
                    </svg>
                    Save
                  </button>
                  <button
                    className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-fit p-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default EditUrl;
