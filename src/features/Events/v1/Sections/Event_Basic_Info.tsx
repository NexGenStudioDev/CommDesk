import { MdMedicalInformation } from "react-icons/md";
import { getTheme } from "../../../../config/them.config";
import { IoMdCloudUpload } from "react-icons/io";
import { Input } from "../../../../Component/ui/Input";
import { useState } from "react";
import DropDown from "../../../../Component/ui/DropDown";
import { EVENT_CATEGORY, EVENT_TYPE } from "../Constants/Event.constant";
import Button from "../../../../Component/ui/Button";
import MarkdownToJsx from "../../../../Component/ui/MarkdownToJsx";
import { FaLink } from "react-icons/fa";

const Event_Basic_Info = () => {
  let theme = getTheme("light");

  let [eventData, setEventData] = useState({
    title: "",
    eventType: "",
    description: "",
    coverImage: null,
    registrationLink: "",
    startDate: null,
    endDate: null,
    location: "",
    category: "",
    tags: [],
  });

  let [isPreviewMode, setIsPreviewMode] = useState(false);

  return (
    <div
      className="flex flex-col w-full p-8 border-2 rounded-lg"
      style={{
        background: theme.background.primary,
        borderColor: theme.borderColor.primary,
      }}
    >
      <span className="font-extrabold text-xl text-gray-800 uppercase mb-[3vh] flex items-center gap-3">
        <MdMedicalInformation className="text-[#4f46e5]" />
        Event Information
      </span>

      <div className="flex flex-col gap-4  ">
        <p className="text-md text-gray-400 uppercase font-semibold">Event Cover Image</p>

        <div className="w-full flex h-[15vh] flex-col gap-2  mb-4">
          <div
            className="w-full h-full border-2 border-dashed rounded-lg flex flex-col items-center justify-center bg-gray-50"
            style={{
              borderColor: theme.borderColor.primary,
            }}
          >
            <IoMdCloudUpload className="text-2xl text-gray-400" />
            <p className="text-[1vw]">Click to upload or drag and drop</p>
            <p className="text-[1vw]">PNG , JPG up to 10MB (16:9 aspect ratio)</p>
          </div>
        </div>

        <div className="flex flex-col">
          <Input
            label="Event Title"
            name="title"
            placeholder="Enter your event title"
            value={eventData.title}
            onChange={(name, value) => setEventData({ ...eventData, [name]: value })}
          />

          <Input
            label="Registration Link"
            name="registrationLink"
            type="url"
            placeholder="Enter registration link"
            className="my-[2vh]"
            leftIcon={<FaLink className="text-gray-400" />}
            value={eventData.registrationLink}
            onChange={(name, value) => setEventData({ ...eventData, [name]: value })}
          />

          <div className="flex gap-[5%] w-full ">
            <DropDown
              options={EVENT_TYPE}
              label="Event Type"
              className="w-[48%]"
              onSelect={(value) => setEventData({ ...eventData, eventType: value })}
            />

            <DropDown
              options={EVENT_CATEGORY}
              label="Event Category"
              className="w-[48%]"
              onSelect={(value) => setEventData({ ...eventData, category: value })}
            />
          </div>

          <div className="Description flex flex-col mt-[4vh]">
            <div
              className="w-full flex items-center justify-between px-4 py-4 rounded-t-lg border-2 border-b-0"
              style={{
                backgroundColor: theme.background.tertiary,
                borderColor: theme.borderColor.primary,
              }}
            >
              <p
                className="text-base font-semibold uppercase tracking-wide"
                style={{ color: theme.textColor.primary }}
              >
                Event Description
              </p>

              <div className="flex gap-2">
                <Button
                  text="Write"
                  backgroundColor={
                    isPreviewMode ? theme.background.primary : theme.textColor.tersiary
                  }
                  textColor={isPreviewMode ? theme.textColor.secondary : "#ffffff"}
                  onClick={() => setIsPreviewMode(false)}
                />

                <Button
                  text="Preview"
                  backgroundColor={
                    isPreviewMode ? theme.textColor.tersiary : theme.background.primary
                  }
                  textColor={isPreviewMode ? "#ffffff" : theme.textColor.secondary}
                  onClick={() => setIsPreviewMode(true)}
                />
              </div>
            </div>

            <div
              className="border-2 border-t-0 rounded-b-lg"
              style={{ borderColor: theme.borderColor.primary }}
            >
              {isPreviewMode ? (
                <div
                  className="min-h-[24vh] p-4"
                  style={{
                    backgroundColor: theme.background.primary,
                    color: theme.textColor.secondary,
                  }}
                >
                  {eventData.description.trim() ? (
                    <MarkdownToJsx markdown={eventData.description} />
                  ) : (
                    <p className="italic">Preview will appear here...</p>
                  )}
                </div>
              ) : (
                <textarea
                  value={eventData.description}
                  onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                  placeholder="Write your event description here in markdown language..."
                  className="w-full min-h-[24vh] p-4  rounded-b-lg resize-none focus:outline-none"
                  style={{
                    backgroundColor: theme.background.primary,
                    borderColor: theme.borderColor.primary,
                    color: theme.textColor.secondary,
                  }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Event_Basic_Info;

//  className="w-full flex flex-col "
//       style={{
//         background: theme.background.secondary,
//       }}
