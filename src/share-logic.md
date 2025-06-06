Creating a Share on LinkedIn
There are multiple ways to share content with your LinkedIn network. In this guide, we will show you how to create shares using text, URLs, and images. For all shares created on LinkedIn, the request will always be a POST request to the User Generated Content (UGC) API.

API Request
HTTP

Copy
POST https://api.linkedin.com/v2/ugcPosts
Note

All requests require the following header: X-Restli-Protocol-Version: 2.0.0

Request Body Schema
Field Name Description Format Required
author The author of a share contains Person URN of the Member creating the share. See Sign In with LinkedIn using OpenID Connect to see how to retrieve the Person URN. Person URN Yes
lifecycleState Defines the state of the share. For the purposes of creating a share, the lifecycleState will always be PUBLISHED. string Yes
specificContent Provides additional options while defining the content of the share. ShareContent Yes
visibility Defines any visibility restrictions for the share. Possible values include:
CONNECTIONS - The share will be viewable by 1st-degree connections only.
PUBLIC - The share will be viewable by anyone on LinkedIn.
MemberNetworkVisibility Yes
Share Content
Field Name Description Format Required
shareCommentary Provides the primary content for the share. string Yes
shareMediaCategory Represents the media assets attached to the share. Possible values include:
NONE - The share does not contain any media, and will only consist of text.
ARTICLE - The share contains a URL.
IMAGE - The Share contains an image.
string Yes
media If the shareMediaCategory is ARTICLE or IMAGE, define those media assets here. ShareMedia[] No
Share Media
Field Name Description Format Required
status Must be configured to READY. string Yes
description Provide a short description for your image or article. string No
media ID of the uploaded image asset. If you are uploading an article, this field is not required. DigitalMediaAsset URN No
originalUrl Provide the URL of the article you would like to share here. string No
title Customize the title of your image or article. string No
Create a Text Share
The example below creates a simple text Share on LinkedIn. Notice the visibility is set to PUBLIC, where anyone on the LinkedIn Platform can view this share.

Sample Request Body
JSON

Copy
{
"author": "urn:li:person:8675309",
"lifecycleState": "PUBLISHED",
"specificContent": {
"com.linkedin.ugc.ShareContent": {
"shareCommentary": {
"text": "Hello World! This is my first Share on LinkedIn!"
},
"shareMediaCategory": "NONE"
}
},
"visibility": {
"com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
}
}

Create an Image or Video Share
If you'd like to attach an image or video to your share, you will first need to register, then upload your image/video to LinkedIn before the share can be created. We will walk through the following steps to create the share:

Register your image or video to be uploaded.
Upload your image or video to LinkedIn.
Create the image or video share.
Register the Image or Video
Send a POST request to the assets API, with the action query parameter to registerUpload.

HTTP

Copy
POST https://api.linkedin.com/v2/assets?action=registerUpload
Similar to the author parameter we've used with the ugcPosts API, we will need to provide our Person URN. Additional recipes and serviceRelationships define the type of content we're publishing. For Share on LinkedIn, recipes will always contain either the type feedshare-image or the type feedshare-video (depending on which of the two you are uploading) and serviceRelationships will always define the relationshipType and identifier. See the request body below for reference.

JSON

Copy
{
"registerUploadRequest": {
"recipes": [
"urn:li:digitalmediaRecipe:feedshare-image"
],
"owner": "urn:li:person:8675309",
"serviceRelationships": [
{
"relationshipType": "OWNER",
"identifier": "urn:li:userGeneratedContent"
}
]
}
}
A successful response will contain an uploadUrl and asset that you will need to save for the next steps.

JSON

Copy
{
"value": {
"uploadMechanism": {
"com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest": {
"headers": {},
"uploadUrl": "https://api.linkedin.com/mediaUpload/C5522AQGTYER3k3ByHQ/feedshare-uploadedImage/0?ca=vector_feedshare&cn=uploads&m=AQJbrN86Zm265gAAAWemyz2pxPSgONtBiZdchrgG872QltnfYjnMdb2j3A&app=1953784&sync=0&v=beta&ut=2H-IhpbfXrRow1"
}
},
"mediaArtifact": "urn:li:digitalmediaMediaArtifact:(urn:li:digitalmediaAsset:C5522AQGTYER3k3ByHQ,urn:li:digitalmediaMediaArtifactClass:feedshare-uploadedImage)",
"asset": "urn:li:digitalmediaAsset:C5522AQGTYER3k3ByHQ"
}
}
Upload Image or Video Binary File
Using the uploadUrl returned from Step 1, upload your image or video to LinkedIn. To upload your image or video, send a POST request to the uploadUrl with your image or video included as a binary file. The example below uses cURL to upload an image file.

Sample Request
Bash

Copy
curl -i --upload-file /Users/peter/Desktop/superneatimage.png --header "Authorization: Bearer redacted" 'https://api.linkedin.com/mediaUpload/C5522AQGTYER3k3ByHQ/feedshare-uploadedImage/0?ca=vector_feedshare&cn=uploads&m=AQJbrN86Zm265gAAAWemyz2pxPSgONtBiZdchrgG872QltnfYjnMdb2j3A&app=1953784&sync=0&v=beta&ut=2H-IhpbfXrRow1'
Create the Image or Video Share
After the image or video file has successfully uploaded from Step 2, we will use the asset from Step 1 to attach the image to our share. Below is a sample request for an image; for a video, the shareMediaCategory should be VIDEO instead of IMAGE.

Sample Request Body
JSON

Copy
{
"author": "urn:li:person:8675309",
"lifecycleState": "PUBLISHED",
"specificContent": {
"com.linkedin.ugc.ShareContent": {
"shareCommentary": {
"text": "Feeling inspired after meeting so many talented individuals at this year's conference. #talentconnect"
},
"shareMediaCategory": "IMAGE",
"media": [
{
"status": "READY",
"description": {
"text": "Center stage!"
},
"media": "urn:li:digitalmediaAsset:C5422AQEbc381YmIuvg",
"title": {
"text": "LinkedIn Talent Connect 2021"
}
}
]
}
},
"visibility": {
"com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
}
}
Response
A successful response will return 201 Created, and the newly created post will be identified by the X-RestLi-Id response header.
