import { useState, useRef, useCallback } from "react";
import Input from "@/Component/ui/Input";
import TextArea from "@/Component/ui/TextArea";
import Url from "@/Component/ui/Url";
import DropDown from "@/Component/ui/DropDown";
import { MdPerson } from "react-icons/md";

const Community_Info = () => {
  const [ImageUrl, setImageUrl] = useState<string>("");
  const [formData, setFormData] = useState({
    communityName: "",
    communityDescription: "",
    city: "",
    mobileNumber: "",
    email: "",
  });
  const ImageRef = useRef<HTMLInputElement | null>(null);

  // Handle file input change and preview
  const handleFileSelection = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // For custom Input/TextArea components
  const handleChange = useCallback((name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  return (
    <div className="h-full w-full inter">
      <div className="Title flex flex-col my-[3vh]">
        <h1 className="text-2xl font-bold inter text-gray-700">Community Info</h1>
        <p className="text-gray-500 mt-2 inter">Tell us about your community to get started.</p>
      </div>

      <div className="flex flex-col gap-3">
        <Input
          name="communityName"
          label="Community Name"
          placeholder="Enter your community name"
          value={formData.communityName}
          onChange={handleChange}
        />

        <div
          className="w-full flex flex-col gap-3 mt-[3vh] mb-[4vh]"
          onClick={() => ImageRef.current?.click()}
        >
          <div className="h-full w-full">Community Logo</div>
          <div className="w-full flex gap-1.5">
            <div className="Logo rounded-full p-2 bg-gray-300 w-fit text-[2vw]">
              {ImageUrl ? (
                <img
                  src={ImageUrl}
                  alt="Community Logo"
                  className="rounded-full w-20 h-20 object-cover"
                />
              ) : (
                <MdPerson />
              )}
            </div>
            <div className="flex flex-col gap-1 p-2">
              <p className="text-blue-700 rounded-md cursor-pointer  font-black">Change Photo</p>
              <p className="text-gray-500 text-sm">Recommended size: 400x400px</p>
            </div>
            <input
              ref={ImageRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileSelection}
            />
          </div>
        </div>

        <TextArea
          name="communityDescription"
          label="Community Description"
          className="text-md"
          value={formData.communityDescription}
          onChange={handleChange}
          placeholder="Describe your community in a few sentences"
        />

        <div className="flex gap-3 items-center justify-center w-full">
          <Input
            label="Mobile Number"
            name="mobileNumber"
            placeholder="Enter your mobile number"
            value={formData.mobileNumber}
            onChange={handleChange}
            className="w-1/2"
          />

          <Input
            label="Email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="w-1/2"
          />
        </div>

        <div className="flex gap-3  w-full ">
          <DropDown
            className="w-1/2! -my-1!"
            label="Country"
            options={["United States", "Canada", "United Kingdom", "Australia", "India"]}
            onSelect={(e) => console.log(e)}
          />

          <Input
            label="City"
            placeholder="Enter your city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-1/2 "
          />
        </div>

        <Url domain="www.comunity.com" protocol="https://" />
      </div>
    </div>
  );
};

export default Community_Info;
