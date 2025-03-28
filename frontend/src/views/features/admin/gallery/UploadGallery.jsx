import React, { memo, useCallback, useEffect, useState, useRef } from 'react';
import Mainwrapper from '@/views/layouts/Mainwrapper';
import { Card, CardHeader, CardDescription, CardContent, CardTitle } from '@/components/ui/card';
import { CloudUpload, Upload } from 'lucide-react';
import { getImageSizeFormat } from '@/helpers/file-size';
import { Button } from '@/components/ui/button';
import _ from '@/helpers/loadash';
import axios from 'axios';
import { getAccessToken } from '@/helpers/local-storage';
import { API_URL } from '@/services/config';
import { useDispatch, useSelector } from 'react-redux';
import { mosqueActions } from '@/redux/combineActions';

const INITIAL_STATE = {
  uploadImages: {},
  uploadSize: 0,
  startedUploading: true,
  uploadLimit: 2,
  currentUpload: 1,
};

const MAX_FILE_SIZE = 2 * 1024 * 1024; //2Mb

const breadCumbs = [{ label: 'Gallery', href: null }];

const UploadGallery = () => {
  const dispatch = useDispatch();
  const { communityMosqueDetail, communityMosqueSettings } = useSelector(
    (state) => state.mosqueState
  );

  const { getCommunityMosqueDetailsAction } = mosqueActions;

  const [info, setInfo] = useState({ ...INITIAL_STATE });
  const recentImageInitiatedRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (selectedFiles.length < 0) return;

    let uploadedImages = { ...info?.uploadImages };
    let uploadedSize = info?.uploadSize;

    selectedFiles.forEach((singleImage) => {
      let uploadedImageCount = Object.keys(uploadedImages)?.length;
      let isDuplicate =
        communityMosqueDetail?.images?.find((item) => item?.originalName === singleImage?.name) ??
        false;

      if (singleImage.size <= MAX_FILE_SIZE && uploadedImageCount <= 20 && !isDuplicate) {
        uploadedImages[singleImage.name] = {
          file: singleImage,
          isUploaded: false,
          uploadedPercentage: 0,
          isFailed: false,
          size: singleImage.size,
        };
        uploadedSize += singleImage.size;
      }
    });

    setInfo((prev) => ({ ...prev, uploadImages: uploadedImages, uploadSize: uploadedSize }));
  };

  const getJsonFunction = (currentImage) => {
    const imageKeysArray = _.keys(info?.uploadImages || {});
    const imageKeyIndex =
      recentImageInitiatedRef.current !== null
        ? imageKeysArray[imageKeysArray.indexOf(currentImage)]
        : imageKeysArray[0];
    const image = info?.uploadImages[imageKeyIndex];

    if (image && image?.isUploaded) return null;

    const formData = new FormData();
    formData.append('galleryImage', image.file);

    recentImageInitiatedRef.current = currentImage;

    return formData;
  };

  const uploadToServerFunction = async (form, currentFile) => {
    try {
      const token = getAccessToken();
      const config = {
        onUploadProgress: (progressEvent) => {
          const { loaded, total } = progressEvent;
          const progressPercentage = Math.floor((loaded * 100) / total);
          if (progressPercentage <= 100) {
            setInfo((prev) => {
              const uploadImages = { ...prev.uploadImages };
              uploadImages[currentFile]['uploadedPercentage'] = parseInt(progressPercentage);
              return { ...prev, uploadImages };
            });
          }
        },
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      };
      const url = API_URL + '/mosque/community/gallery';
      const { data } = await axios.post(url, form, config);
      return data;
    } catch (error) {
      return false;
    }
  };

  const uploadFilesConcurrently = async () => {
    const queue = _.keys(info.uploadImages);
    const activeUploads = [];
    let totalImages = _.size(info.uploadImages || {});
    setInfo((prev) => ({ ...prev, startedUploading: true }));

    const nextUploadFunc = async () => {
      if (queue.length === 0) return;
      const currentFile = queue.shift();
      const json = getJsonFunction(currentFile);
      let attempts = 0;
      let isSuccessUpload = false;

      while (attempts < 3) {
        let uploadPromise = await uploadToServerFunction(json, currentFile);
        activeUploads.push(uploadPromise);
        isSuccessUpload = await uploadPromise;

        if (isSuccessUpload) {
          activeUploads.splice(activeUploads.indexOf(uploadPromise), 1);
          let json = {
            details: isSuccessUpload?.details,
            settings: communityMosqueSettings,
          };
          dispatch(getCommunityMosqueDetailsAction(json));
          break;
        }

        if (attempts !== 0) {
          // Wait for 1 minute before retrying
          setInfo((prev) => ({
            ...prev,
            uploadImages: {
              ...prev.uploadImages,
              [currentFile]: { ...prev.uploadImages[currentFile], isFailed: true },
            },
          }));
          let waitTime = 2000 * attempts;
          await new Promise((resolve) => {
            console.log('waiting  for ', waitTime, 'seconds');
            setTimeout(() => {
              resolve();
            }, waitTime);
          });
        }
        attempts++;
      }

      if (isSuccessUpload) {
        nextUploadFunc();
      }
    };

    for (let i = 0; i < info.uploadLimit && queue.length > 0; i++) {
      console.log(i, 'loop');
      nextUploadFunc();
    }

    await Promise.allSettled(activeUploads);
  };

  return (
    <Mainwrapper breadCumbs={breadCumbs}>
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <CloudUpload size={35} color="#6c7479" />
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              SVG, PNG, JPG or GIF (MAX. 20 Images, each up to 2MB)
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            accept="image/*"
            className="hidden"
            multiple
            onChange={handleFileChange}
          />
        </label>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between">
            <div className="text_div">
              <h1>
                {Object.keys(info?.uploadImages || {}).length} Images added -{' '}
                {getImageSizeFormat(info?.uploadSize)}
              </h1>
            </div>

            <Button
              className={`rounded-full ${_.size(info?.uploadImages) === 0 ? 'opacity-20' : ''}`}
              onClick={uploadFilesConcurrently}
            >
              {' '}
              <Upload /> Start Upload
            </Button>
          </CardTitle>
          <CardDescription>Max amount 20 photos</CardDescription>
        </CardHeader>

        <CardContent>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  File Name
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Size
                </th>

                {info?.startedUploading && (
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Upload Status
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {Object.entries(info?.uploadImages).map(([fileName, fileData]) => (
                <tr key={fileName}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {fileName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {getImageSizeFormat(fileData?.size)}
                  </td>
                  {info?.startedUploading && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 flex gap-4 items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2.5  dark:bg-gray-700">
                        <div
                          className="bg-gray-600 h-2.5 rounded-full dark:bg-gray-300"
                          style={{ width: `${fileData?.uploadedPercentage}%` }}
                        ></div>
                      </div>
                      <p className="m-0 p-0">{fileData?.uploadedPercentage}%</p>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </Mainwrapper>
  );
};

export default memo(UploadGallery);
