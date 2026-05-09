import { MdMedicalInformation } from "react-icons/md";
import { IoMdCloudUpload } from "react-icons/io";
import { Input } from "../../../../Component/ui/Input";
import { useState } from "react";
import DropDown from "../../../../Component/ui/DropDown";
import { EVENT_CATEGORY, EVENT_TYPE } from "../Constants/Event.constant";
import Button from "../../../../Component/ui/Button";
import MarkdownToJsx from "../../../../Component/ui/MarkdownToJsx";
import { FaLink } from "react-icons/fa";

const Event_Basic_Info = () => {
  const [eventData, setEventData] = useState({
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

  const [isPreviewMode, setIsPreviewMode] = useState(false);

  return (
    <div
      className="flex flex-col w-full p-8 rounded-xl"
      style={{
        backgroundColor: "var(--cd-surface)",
        border: "1px solid var(--cd-border)",
      }}
    >
      <span
        className="font-extrabold text-xl uppercase mb-[3vh] flex items-center gap-3"
        style={{ color: "var(--cd-text)" }}
      >
        <MdMedicalInformation style={{ color: "var(--cd-primary)" }} />
        Event Information
      </span>

      <div className="flex flex-col gap-4">
        <p className="text-xs font-semibold uppercase" style={{ color: "var(--cd-text-2)" }}>
          Event Cover Image
        </p>

        <div className="w-full flex h-[15vh] flex-col gap-2 mb-4">
          <div
            className="w-full h-full border-2 border-dashed rounded-xl flex flex-col items-center justify-center"
            style={{
              borderColor: "var(--cd-border)",
              backgroundColor: "var(--cd-surface-2)",
            }}
          >
            <IoMdCloudUpload className="text-2xl" style={{ color: "var(--cd-text-muted)" }} />
            <p className="text-xs mt-1" style={{ color: "var(--cd-text-muted)" }}>
              Click to upload or drag and drop
            </p>
            <p className="text-xs" style={{ color: "var(--cd-text-muted)" }}>
              PNG, JPG up to 10MB (16:9 aspect ratio)
            </p>
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
            leftIcon={<FaLink style={{ color: "var(--cd-text-muted)" }} />}
            value={eventData.registrationLink}
            onChange={(name, value) => setEventData({ ...eventData, [name]: value })}
          />

          <div className="flex gap-[5%] w-full">
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

          <div className="flex flex-col mt-[4vh]">
            <div
              className="w-full flex items-center justify-between px-4 py-3 rounded-t-xl border border-b-0"
              style={{
                backgroundColor: "var(--cd-surface-2)",
                borderColor: "var(--cd-border)",
              }}
            >
              <p
                className="text-sm font-semibold uppercase tracking-wide"
                style={{ color: "var(--cd-text)" }}
              >
                Event Description
              </p>
              <div className="flex gap-2">
                <Button
                  text="Write"
                  variant={isPreviewMode ? "secondary" : "primary"}
                  onClick={() => setIsPreviewMode(false)}
                />
                <Button
                  text="Preview"
                  variant={isPreviewMode ? "primary" : "secondary"}
                  onClick={() => setIsPreviewMode(true)}
                />
              </div>
            </div>

            <div
              className="border border-t-0 rounded-b-xl"
              style={{ borderColor: "var(--cd-border)" }}
            >
              {isPreviewMode ? (
                <div
                  className="min-h-[24vh] p-4"
                  style={{
                    backgroundColor: "var(--cd-surface)",
                    color: "var(--cd-text-2)",
                  }}
                >
                  {eventData.description.trim() ? (
                    <MarkdownToJsx markdown={eventData.description} />
                  ) : (
                    <p className="italic" style={{ color: "var(--cd-text-muted)" }}>
                      Preview will appear here...
                    </p>
                  )}
                </div>
              ) : (
                <textarea
                  value={eventData.description}
                  onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                  placeholder="Write your event description here in markdown..."
                  className="w-full min-h-[24vh] p-4 rounded-b-xl resize-none focus:outline-none"
                  style={{
                    backgroundColor: "var(--cd-surface)",
                    color: "var(--cd-text)",
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
