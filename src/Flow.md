<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" class="logo" width="120"/>

# How to Share UGC Content on LinkedIn Company Pages Using the Developer API

LinkedIn's developer APIs provide powerful tools for businesses to programmatically share content on their company pages. This report details the process of creating User Generated Content (UGC) posts through LinkedIn's developer APIs, specifically focusing on company page implementations. The platform offers dedicated endpoints and structured requests that allow developers to share various media types including text, URLs, images, and videos on behalf of organizations.

## Understanding LinkedIn's UGC APIs

LinkedIn offers multiple API options for sharing content, with the primary method being the User Generated Content (UGC) Post API. This API allows developers to programmatically create and publish content on LinkedIn company pages, though there are important prerequisites and structural considerations.

### Prerequisites for Company Page Posting

Before attempting to post content to a company page via LinkedIn's API, developers must satisfy specific requirements:

1. Partner Program Membership: To post content to a company page using the UGC Posts API, you need to apply for the LinkedIn partner program to obtain the necessary "manage pages" permissions[^1_2]. This is available through the LinkedIn Marketing Developer Program.
2. Authorization Roles: The member using the API must have the role of Company Page "ADMINISTRATOR" or "DIRECT_SPONSORED_CONTENT_POSTER" to successfully create posts[^1_3].
3. API Access: Ensure your application has the appropriate OAuth scopes and permissions to create content on behalf of an organization.
4. Content Guidelines: Be aware that LinkedIn enforces policies regarding content shared via their platform, including audience targeting requirements that specify a minimum audience size of 300 members[^1_3].

### API Structure and Endpoints

The UGC Post API functions through a structured REST interface with specific endpoints and payload formats:

```
POST https://api.linkedin.com/v2/ugcPosts
```

All requests to this endpoint require the header `X-Restli-Protocol-Version: 2.0.0`[^1_1]. The content type must be set to application/json when making requests[^1_3].

The request body follows a structured schema with mandatory fields including:

1. Author information (organization URN)
2. Lifecycle state
3. Specific content details
4. Visibility settings

## Creating UGC Posts for Company Pages

Creating posts on behalf of a company page requires careful attention to the structure of your API request. The following sections outline the essential components needed for successful posting.

### Basic Request Structure

A minimal UGC post request for a company page must include:

```json
{
  "author": "urn:li:organization:ORGANIZATION_ID",
  "lifecycleState": "PUBLISHED",
  "specificContent": {
    "com.linkedin.ugc.ShareContent": {
      "shareCommentary": {
        "text": "Your post text content here"
      },
      "shareMediaCategory": "NONE"
    }
  },
  "visibility": {
    "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
  }
}
```

Where ORGANIZATION_ID is replaced with your company's LinkedIn identifier[^1_3]. The lifecycleState value "PUBLISHED" is the only accepted field during creation, indicating the post should be immediately published[^1_3].

### Adding Media to Posts

Posts can include various media types including articles, images, and videos. The appropriate `shareMediaCategory` value must be specified based on the media type being included[^1_1]:

#### For Image Posts:

```json
{
  "specificContent": {
    "com.linkedin.ugc.ShareContent": {
      "shareCommentary": {
        "text": "Post with image"
      },
      "shareMediaCategory": "IMAGE",
      "media": [
        {
          "status": "READY",
          "description": {
            "text": "Image description"
          },
          "media": "urn:li:digitalmediaAsset:MEDIA_ASSET_ID",
          "title": {
            "text": "Image title"
          }
        }
      ]
    }
  }
}
```

Where MEDIA_ASSET_ID refers to a previously uploaded digital media asset[^1_1][^1_3].

#### For Video Posts:

```json
{
  "specificContent": {
    "com.linkedin.ugc.ShareContent": {
      "shareCommentary": {
        "text": "Video post"
      },
      "shareMediaCategory": "VIDEO",
      "media": [
        {
          "status": "READY",
          "media": "urn:li:digitalmediaAsset:VIDEO_ASSET_ID",
          "title": {
            "text": "Video title"
          }
        }
      ]
    }
  }
}
```

For video dark posts specifically, the `landingPageUrl` is a required field within the media object[^1_3].

#### For Article Posts:

```json
{
  "specificContent": {
    "com.linkedin.ugc.ShareContent": {
      "shareCommentary": {
        "text": "Article share"
      },
      "shareMediaCategory": "ARTICLE",
      "media": [
        {
          "status": "READY",
          "originalUrl": "https://example.com/article",
          "title": {
            "text": "Article title"
          },
          "description": {
            "text": "Article description"
          }
        }
      ]
    }
  }
}
```

The `originalUrl` field links to the article being shared, with a maximum allowed length of 8192 characters[^1_3].

## Post Visibility and Distribution Options

LinkedIn's API offers granular control over who can see your posts and how they're distributed within the LinkedIn ecosystem.

### Visibility Settings

For company posts, two primary visibility options exist:

1. **Member Network Visibility**: Controls visibility within LinkedIn's network.

```json
"visibility": {
  "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC"
}
```

2. **Sponsored Content Visibility**: Used for dark posts intended for ads.

```json
"visibility": {
  "com.linkedin.ugc.SponsoredContentVisibility": "DARK"
}
```

Note that `SponsoredContentVisibility` can only be set when the `author` is an organization URN[^1_3].

### Distribution Configuration

For more controlled distribution, the API allows specification of distribution parameters:

```json
"distribution": {
  "feedDistribution": "MAIN_FEED",
  "distributedViaFollowFeed": true,
  "externalDistributionChannels": [
    {
      "externalDistributionChannelType": "ORGANIZATION"
    }
  ]
}
```

This configuration determines where on LinkedIn your content will appear and can include external distribution channels[^1_3].

## Target Audience Specification

LinkedIn's API allows for targeted distribution of content to specific audience segments:

```json
"targetAudience": {
  "targetedEntities": [
    {
      "industries": ["urn:li:industry:42"],
      "geoLocations": ["urn:li:geo:103644278"],
      "seniorities": ["urn:li:seniority:3"]
    }
  ]
}
```

LinkedIn requires that targeted audiences must exceed 300 members to meet their audience size threshold requirements[^1_3].

## Advanced Features and Best Practices

### Adding Interactive Elements

Posts can include interactive elements such as call-to-action buttons:

```json
"media": [
  {
    "landingPage": {
      "landingPageTitle": "LEARN_MORE",
      "landingPageUrl": "https://example.com"
    }
  }
]
```

Valid landingPageTitle values include "LEARN_MORE", "APPLY_NOW", "DOWNLOAD", "GET_QUOTE", "SIGN_UP", "SUBSCRIBE", and "REGISTER"[^1_3].

### Handling Response and Post Identification

When a UGC Post is successfully created, LinkedIn returns a `201 Created` response. The `ugcPost` ID is contained in the response header `x-restli-id`[^1_3]. This ID can be used to construct a URL to view the post:

```
https://www.linkedin.com/feed/update/urn:li:ugcPost:&lt;id&gt;/
```

### Authentication and Permission Verification

Before creating posts, ensure that:

1. Your application has the appropriate OAuth access tokens.
2. The user has the necessary permissions on the company page.
3. For media posts, verify that the `registerUploadRequest.owner` field of the referenced asset matches the `author` field in the UGC post[^1_3].

## Conclusion

Creating UGC posts on LinkedIn company pages via the developer API requires adherence to specific structures and prerequisites. While the process involves multiple components—from authorization to content formatting—the API provides extensive flexibility for programmatic content sharing.

For organizations looking to integrate LinkedIn posting into their content management systems or marketing automation platforms, understanding the nuances of the UGC Post API is essential. The ability to programmatically share various content types with targeted audiences offers significant opportunities for streamlined social media management and enhanced content distribution strategies.

To begin implementation, organizations should first apply for the LinkedIn Marketing Developer Program to obtain the necessary permissions, then proceed with structured API requests following the formats outlined in this report.

<div style="text-align: center">⁂</div>

[^1_1]: https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/share-on-linkedin
[^1_2]: https://stackoverflow.com/questions/56157370/share-content-to-an-company-page-on-linkedin-using-api-v2
[^1_3]: https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/ugc-post-api?tabs=http\&view=li-lms-unversioned
[^1_4]: https://stackoverflow.com/questions/72649031/create-linkedin-ugc-post-with-document-asset
[^1_5]: https://www.linkedin.com/business/marketing/blog/content-marketing/how-to-leverage-linkedin-for-user-generated-content-marketing
[^1_6]: https://stackoverflow.com/questions/49871792/how-to-get-ugc-posts-of-an-organization-in-linkedin-v2-api
[^1_7]: https://www.unipile.com/linkedin-api-a-comprehensive-guide-to-integration/
[^1_8]: https://www.linkedin.com/business/marketing/blog/linkedin-pages/opening-our-linkedin-company-page-apis
[^1_9]: https://www.linkedin.com/developers/news/api-changes/may-2021-newsletter
[^1_10]: https://theugcclub.com/linkedin-for-ugc/
[^1_11]: https://stackoverflow.com/questions/49871792/how-to-get-ugc-posts-of-an-organization-in-linkedin-v2-api/55688310
[^1_12]: https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/getting-started?view=li-lms-unversioned
[^1_13]: https://phppot.com/php/how-to-text-share-on-linkedin-using-api-in-php/
[^1_14]: https://brandsmeetcreators.com/blog/linkedin-for-ugc-creators
[^1_15]: https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/ugc-post-api?view=li-lms-unversioned\&viewFallbackFrom=li-lms-2022-10
[^1_16]: https://learn.microsoft.com/en-us/linkedin/compliance/integrations/shares/ugc-post-api
[^1_17]: https://stackoverflow.com/questions/54236989/linkedin-v2-api-how-can-a-ugcpost-urn-be-converted-to-a-share-urn
[^1_18]: https://developer.linkedin.com/product-catalog
[^1_19]: https://stackoverflow.com/questions/55363303/which-version-of-the-ugc-docs-are-correct
[^1_20]: https://dev.to/mayankcse/mastering-linkedin-api-step-by-step-guide-for-seamless-integration-124n
[^1_21]: https://www.youtube.com/watch?v=YJoof1kX_kQ
[^1_22]: https://stackoverflow.com/questions/54982043/does-the-linkedin-ugc-api-contains-all-shares-of-a-linkedin-organization
[^1_23]: https://apicontext.com/api-directory/social-networks/linkedin/
[^1_24]: https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/getting-started?view=li-lms-unversioned
[^1_25]: https://stackoverflow.com/questions/29748022/linkedin-new-developer-program-api-changes-will-company-share-be-available
[^1_26]: https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/ugc-post-api?view=li-lms-unversioned
[^1_27]: https://www.postman.com/linkedin-developer-apis/linkedin-consumer-solutions/request/ax4ylkd/ugcposts-create
[^1_28]: https://www.linkedin.com/pulse/power-user-generated-content-skmktgagency
[^1_29]: https://www.linkedin.com/pulse/everything-you-need-know-using-ugc-social-media-hélène-heath
[^1_30]: https://www.youtube.com/watch?v=HklHXD7VXMU
[^1_31]: https://www.linkedin.com/pulse/how-make-most-out-your-user-generated-content-linkedin-disha-shukla-02npe
[^1_32]: https://www.youtube.com/watch?v=BC4OJX4iPUE
[^1_33]: https://www.linkedin.com/business/marketing/blog/linkedin-pages/opening-our-linkedin-company-page-apis
[^1_34]: https://www.linkedin.com/products/categories/user-generated-content-platforms
[^1_35]: https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/posts-api?view=li-lms-2025-03
[^1_36]: https://www.marketingdive.com/news/linkedin-opens-company-page-api-to-all/158147/
[^1_37]: https://www.linkedin.com/advice/1/how-can-you-use-user-generated-content-build-avqfc
[^1_38]: https://www.nobledesktop.com/learn/social-media-marketing/harnessing-the-power-of-user-generated-content-on-linkedin

---

# Integrating 3-Legged OAuth2 with LinkedIn's UGC Post API for User-Specific Implementations

The LinkedIn Share API's functionality depends on proper implementation of OAuth2 authentication and authorization protocols. For developers working with user-specific content sharing, understanding the role of 3-legged OAuth2 flow becomes critical to ensuring API functionality and user differentiation.

## The Role of 3-Legged OAuth in LinkedIn API Operations

### Authorization Flow Mechanics

The 3-legged OAuth2 flow serves as the foundation for user-specific API operations by establishing a secure delegation protocol[^2_1][^2_5]. This process involves three primary components:

1. **User Authorization**: Members explicitly grant permissions through LinkedIn's consent interface
2. **Token Exchange**: Conversion of temporary authorization codes into access tokens
3. **API Access**: Tokenized requests to LinkedIn's resources on behalf of authenticated users

For UGC Post API implementations, this flow ensures that:

- Each API request is tied to a specific user account
- Access tokens contain granular permissions for content sharing
- LinkedIn's permission model enforces user consent for actions[^2_1]

### User Differentiation Mechanism

The API differentiates users through two key identifiers:

1. **Access Token Binding**: Each token is cryptographically tied to a specific user session
2. **URN Resolution**: The `me` endpoint provides unique resource identifiers for authenticated users[^2_2][^2_3]

```http
GET https://api.linkedin.com/v2/me
Authorization: Bearer {access_token}
```

This combination ensures API requests execute in the context of the authenticated user's permissions and organizational affiliations.

## Solving User ID Dependency in API Operations

### URN Acquisition Workflow

For successful UGC Post API calls, developers must implement:

1. **OpenID Connect Integration**

```http
GET https://www.linkedin.com/oauth/v2/authorization
  ?response_type=code
  &amp;client_id={client_id}
  &amp;redirect_uri={redirect_uri}
  &amp;scope=openid%20profile%20w_member_social
```

This initial request establishes the authentication context and scope requirements[^2_3]. 2. **ID Token Parsing**
Successful authentication returns a JWT containing:

```json
{
  "sub": "urn:li:user:{id}",
  "name": "John Doe",
  "picture": "https://...",
  "email": "john@example.com"
}
```

The `sub` claim provides the essential user URN[^2_3]. 3. **API Request Formation**

```json
{
  "author": "urn:li:user:{id}",
  "specificContent": {
    "com.linkedin.ugc.ShareContent": {
      "shareCommentary": {
        "text": "User-specific content"
      }
    }
  }
}
```

The URN from the ID token becomes the author reference[^2_2].

### Common Implementation Pitfalls

Developers frequently encounter these authorization challenges:

1. **Token Scope Mismatch**
   Required scopes for UGC posting: - `w_member_social` for basic sharing - `w_organization_social` for company pages - `openid profile` for URN resolution[^2_1][^2_3]
2. **Token Lifetime Management**
   LinkedIn access tokens have strict expiration policies requiring proactive renewal[^2_4]:

```mermaid
graph LR
A[Token Expiry] --&gt; B{Valid?}
B --&gt;|Yes| C[API Success]
B --&gt;|No| D[Reauthentication]
```

3. **URN Resolution Failures**
   Essential validation steps: - Verify `me` endpoint response format - Confirm URN structure matches expected patterns - Check token permissions include profile access[^2_2]

## Implementing User-Specific Solutions

### Enhanced Authentication Flow

For production-grade implementations:

1. **Dynamic Scope Management**

```python
def get_scopes(user_type):
    base = ['openid', 'profile']
    if user_type == 'company':
        return base + ['w_organization_social']
    return base + ['w_member_social']
```

2. **Token Refresh Automation**

```javascript
async function refreshToken(oldToken) {
  const response = await fetch("/oauth/refresh", {
    method: "POST",
    body: `grant_type=refresh_token&amp;refresh_token=${oldToken}`,
  });
  return response.json().access_token;
}
```

### API Request Validation Checklist

Before making UGC Post requests:

1. Confirm URN structure matches `urn:li:user:{id}` pattern
2. Verify access token contains required scopes
3. Check token expiration timestamp
4. Validate media asset permissions when including attachments

## Enterprise-Grade Implementation Strategy

For large-scale deployments:

1. **Token Pooling Architecture**

```rust
struct TokenCache {
  user_tokens: HashMap&lt;String, CachedToken&gt;,
  org_tokens: HashMap&lt;Uuid, CachedToken&gt;,
}

impl TokenCache {
  fn get_token(&amp;self, user_id: &amp;str) -&gt; Option&lt;&amp;CachedToken&gt; {
      self.user_tokens.get(user_id)
  }
}
```

2. **Distributed Authorization Service**

```java
@Service
public class OAuthService {
    @Value("${linkedin.client.id}")
    private String clientId;

    public String getAuthorizationUrl(String state) {
        return String.format(
            "https://www.linkedin.com/oauth/v2/authorization?response_type=code&amp;client_id=%s&amp;redirect_uri=%s&amp;state=%s&amp;scope=%s",
            clientId, redirectUri, state, scopes);
    }
}
```

3. **Monitoring and Analytics**
   - Track API success rates per user segment
   - Monitor token refresh frequencies
   - Alert on abnormal permission requests

## Conclusion

Implementing user-specific UGC sharing via LinkedIn's API requires meticulous attention to OAuth2 flow details and URN management. By combining OpenID Connect for user identification with granular scope management, developers can create robust sharing solutions that respect user permissions while maintaining API functionality. The key success factors include proper token lifecycle management, rigorous URN validation, and adaptive scope selection based on content context.

<div style="text-align: center">⁂</div>

[^2_1]: https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow
[^2_2]: https://community.make.com/t/user-id-from-linkedin/16021
[^2_3]: https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin-v2
[^2_4]: https://stackoverflow.com/questions/40047249/linkedin-api-is-it-possible-to-have-more-than-one-access-token-for-a-user-activ
[^2_5]: https://www.ibm.com/docs/en/datapower-gateway/10.5.x?topic=flows-three-legged-oauth-flow
[^2_6]: https://stackoverflow.com/questions/76889585/issues-with-sign-in-with-linkedin-using-openid-connect
[^2_7]: https://learn.microsoft.com/en-us/linkedin/shared/authentication/authentication
[^2_8]: https://www.reddit.com/r/nextjs/comments/1eyfcm0/how_to_implement_oauth_login_using_linkedin/
[^2_9]: https://dev.to/sridhar02/how-to-setup-the-integration-of-linkedin-api-with-oauth-hid
[^2_10]: https://stackoverflow.com/questions/5712217/understanding-the-use-of-the-user-id-in-a-3-legged-oauth-session
[^2_11]: https://www.linkedin.com/pulse/streamlining-your-workflow-linkedins-3-legged-oauth-oscar-wanga-gahjf
[^2_12]: https://stackoverflow.com/questions/77843521/getting-vanityname-from-sign-in-with-linkedin-for-3-legged-authorization-flow
[^2_13]: https://github.com/shric/linkedin-api-example
[^2_14]: https://www.linkedin.com/posts/my-virtual-companies_the-linkedin-api-usesoauth-20for-member-activity-7155488097034493952-iM4l
[^2_15]: https://learn.microsoft.com/en-us/linkedin/shared/authentication/authorization-code-flow?context=linkedin%2Fcontext\&tabs=HTTPS1
[^2_16]: https://stackoverflow.com/questions/68079420/linkedin-authorization-code-flow-3-legged-oauth-connect-to-azure-data-factor
[^2_17]: https://developer.linkedin.com/blog/posts/2018/redirecting-oauth-uas
[^2_18]: https://www.linkedin.com/developers/news/featured-updates/openid-connect-authentication
[^2_19]: https://stackoverflow.com/questions/65385099/linkedin-api-how-to-obtain-the-bearer-access-token
[^2_20]: https://www.linkedin.com/pulse/2-legged-vs-3-oauth-gaurang-mittal
[^2_21]: https://stackoverflow.com/questions/77843521/getting-vanityname-from-sign-in-with-linkedin-for-3-legged-authorization-flow
[^2_22]: https://dev.to/lovestaco/3-step-guide-to-add-linkedin-openid-sign-in-to-your-app-2025-edition-1mjh
[^2_23]: https://www.linkedin.com/advice/0/how-do-you-manage-api-keys-tokens-multiple-users
[^2_24]: https://stackoverflow.com/a/74989251
[^2_25]: https://dev.to/fardinabir/fetching-linkedin-user-data-and-sign-in-with-linkedin-using-openid-connect-3kf
[^2_26]: https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/share-on-linkedin
[^2_27]: https://learn.microsoft.com/en-us/linkedin/shared/integrations/people/profile-api
[^2_28]: https://stackoverflow.com/questions/76896700/linkedin-3-legged-oauth-throws-not-enough-permissions-to-access-get-userinfo
[^2_29]: https://www.josephguadagno.net/2023/08/16/working-with-the-linkedin-api-with-c-sharp
[^2_30]: https://community.make.com/t/user-id-from-linkedin/16021
[^2_31]: https://stateful.com/blog/linkedin-oauth
[^2_32]: https://www.postman.com/linkedin-developer-apis/linkedin-talent-solutions/request/na93ktu/get-person-id-with-3-legged-oauth-flow-r-liteprofile-permission
[^2_33]: https://stackoverflow.com/questions/78243189/not-enough-permissions-to-access-api-request-https-api-linkedin-com-v2-me
[^2_34]: https://developer.orange.com/resources/3-legged-oauth2-0-flow-step-by-step/
[^2_35]: https://community.xano.com/ask-the-community/post/linkedin-oauth-issues-CDfiGOZLBpgUPhd
[^2_36]: https://forum.bubble.io/t/linkedin-oauth-giving-me-error/264240
[^2_37]: https://stackoverflow.com/questions/79448334/sign-in-with-linkedin-using-openid-connect
[^2_38]: https://docs.oracle.com/en/cloud/saas/applications-common/25a/facsa/configure-outbound-api-authentication-using-three-legged-oauth.html
[^2_39]: https://stackoverflow.com/questions/49831475/issues-with-sharing-via-linkedin-api-response-ok-but-posts-not-showing
[^2_40]: https://www.linkedin.com/help/linkedin/answer/a525063
[^2_41]: https://learn.microsoft.com/en-us/linkedin/shared/api-guide/concepts/error-handling
[^2_42]: https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/share-api?view=li-lms-unversioned
[^2_43]: https://learn.microsoft.com/en-us/answers/questions/1365684/linkedin-api-error-insufficient-permissions-for-ge
[^2_44]: https://docs.oracle.com/en/cloud/saas/applications-common/24a/faser/configure-outbound-api-authentication-using-three-legged-oauth.html
[^2_45]: https://stackoverflow.com/questions/77920692/issue-with-linkedin-openid-sso
[^2_46]: https://support.influitive.com/hc/en-us/articles/15751199038354-Problems-Signing-in-or-Sharing-with-LinkedIn
[^2_47]: https://stackoverflow.com/questions/14974734/api-authentication-authorisation-oauth-3-legged-approach-am-i-doing-it-right
[^2_48]: https://learn.microsoft.com/en-au/answers/questions/1365684/linkedin-api-error-insufficient-permissions-for-ge
[^2_49]: https://stackoverflow.com/questions/46960458/any-queries-to-the-api-linkedin-com-v2-return-not-enough-permissions-to-access
[^2_50]: https://learn.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/sign-in-with-linkedin-v2
[^2_51]: https://github.com/nextauthjs/next-auth/issues/8831
[^2_52]: https://stackoverflow.com/questions/73171138/shares-endpoint-on-linkedin-api-not-working
[^2_53]: https://www.reddit.com/r/Angular2/comments/126xy7m/twitter_oauth_threelegged_authentication_client/
