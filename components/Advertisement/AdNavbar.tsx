"use client";
import { AdNavbarProps } from "@/types/interfaces";
import {
  Button,
  useDisclosure,
} from "@heroui/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaTelegram,
} from "react-icons/fa";
import { IoIosArrowBack } from "react-icons/io";
import { IoShareSocialOutline } from "react-icons/io5";
import ShareModal from "../ShareModal";

export function AdNavbar({ url, title, count, isSingle }: AdNavbarProps) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  return (
    <header>
      <div className="md:hidden min-h-[50px] flex flex-wrap w-full bg-white justify-between py-1 shadow-md relative">
        <div className="flex items-center">
          <Button size="sm" variant="light" onPress={onOpen}>
            <IoShareSocialOutline opacity={0.8} size={26} />
          </Button>
        </div>
        <div className="flex flex-col items-center text-center self-center">
          <span className="font-semibold text-md">{title}</span>
          {!isSingle && (
            <span className="text-gray-600 text-sm">
              {!count || count === 0
                ? "آگهی پیدا نشد"
                : `${count} آگهی پیدا شد`}
            </span>
          )}
        </div>
        <div className="flex items-center">
          <Button size="sm" variant="light" onPress={router.back}>
            <IoIosArrowBack size={26} opacity={0.8} />
          </Button>
        </div>
      </div>
      <ShareModal
        isOpen={isOpen}
        onClose={onClose}
        headerTitle="اشتراک گذاری در"
        body={
          <>
            <Link
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                url
              )}`}
              target="_blank"
              className="text-blue-600 hover:text-blue-800 border p-2 rounded-md"
            >
              <FaFacebookF size={24} />
            </Link>
            <Link
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                url
              )}`}
              target="_blank"
              className="text-blue-400 hover:text-blue-600  border p-2 rounded-md"
            >
              <FaTwitter size={24} />
            </Link>
            <Link
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
                url
              )}`}
              target="_blank"
              className="text-blue-700 hover:text-blue-900 border p-2 rounded-md"
            >
              <FaLinkedinIn size={24} />
            </Link>
            <Link
              href={`https://www.instagram.com/share?url=${encodeURIComponent(
                url
              )}`}
              target="_blank"
              className="text-pink-600 hover:text-pink-800 border p-2 rounded-md"
            >
              <FaInstagram size={24} />
            </Link>
            <Link
              href={`https://t.me/share/url?url=${encodeURIComponent(url)}`}
              target="_blank"
              className="text-blue-500 hover:text-blue-700 border p-2 rounded-md"
            >
              <FaTelegram size={24} />
            </Link>
          </>
        }
      />
      {/* <Modal isOpen={isOpen} size={"sm"} onClose={onClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-row gap-1">
                اشتراک گذاری در
              </ModalHeader>
              <ModalBody className="flex flex-row justify-around p-4 flex-wrap"></ModalBody>
            </>
          )}
        </ModalContent>
      </Modal> */}
    </header>
  );
}
