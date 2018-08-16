# HardenizeOrgApi.CertificatesApi

All URIs are relative to *https://www.hardenize.com/org/{orgLabel}/api/v0*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createACertificate**](CertificatesApi.md#createACertificate) | **PUT** /certs/ | Creates a new certificate
[**listCertificates**](CertificatesApi.md#listCertificates) | **GET** /certs/ | Returns a list of certificates
[**retrieveACertificate**](CertificatesApi.md#retrieveACertificate) | **GET** /certs/{sha256} | Returns the certificate with the given SHA256 hash


<a name="createACertificate"></a>
# **createACertificate**
> createACertificate(body)

Creates a new certificate

Use this API endpoint to upload a new certificate to your account. For example, if you&#39;ve automated certificate generation, we suggest that you also automatically submit all new certificates to Hardenize. That way, when we observe the same certificate via Certificate Transparency, we will know for sure that it belongs to you. We may be able to determine that in any case if we see that the certificate has been installed, but uploading it to us makes this more reliable. 

### Example
```javascript
var HardenizeOrgApi = require('hardenize_org_api');
var defaultClient = HardenizeOrgApi.ApiClient.instance;

// Configure HTTP basic authorization: Basic HTTP Authentication
var Basic HTTP Authentication = defaultClient.authentications['Basic HTTP Authentication'];
Basic HTTP Authentication.username = 'YOUR USERNAME';
Basic HTTP Authentication.password = 'YOUR PASSWORD';

var apiInstance = new HardenizeOrgApi.CertificatesApi();
var body = "body_example"; // String | PEM-encoded certificate
var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully.');
  }
};
apiInstance.createACertificate(body, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **body** | **String**| PEM-encoded certificate | 

### Return type

null (empty response body)

### Authorization

[Basic HTTP Authentication](../README.md#Basic HTTP Authentication)

### HTTP request headers

 - **Content-Type**: application/x-pem-file
 - **Accept**: Not defined

<a name="listCertificates"></a>
# **listCertificates**
> ListCertsResponse listCertificates(opts)

Returns a list of certificates

By default, this endpoint will return a list of all your certificates. If you provide one of the optional parameters, only the certificates matching the specified filters will be listed. If you provide multiple parameters, only the certificates matching all the specified filters will be listed.

### Example
```javascript
var HardenizeOrgApi = require('hardenize_org_api');
var defaultClient = HardenizeOrgApi.ApiClient.instance;

// Configure HTTP basic authorization: Basic HTTP Authentication
var Basic HTTP Authentication = defaultClient.authentications['Basic HTTP Authentication'];
Basic HTTP Authentication.username = 'YOUR USERNAME';
Basic HTTP Authentication.password = 'YOUR PASSWORD';

var apiInstance = new HardenizeOrgApi.CertificatesApi();
var opts = {
  'active': true, // Boolean | If set, returns only active or inactive certificates
  'expired': true, // Boolean | If set, returns only expired or non-expired certificates
  'expireInDays': 14, // Number | If set, returns only certificates that have already expired or expire in the specified number of days, according to the effectiveNotAfter timestamp
  'host': example.com, // String | If set, returns only certificates that are valid for the specified host, either because they contain the exact hostname or because they are wildcards and contain the parent hostname (e.g., a search for blog.example.com will match *.example.com wildcards)
  'spkiSha256': 56c17eb4e3d510f7020e142cd36f617b38f93c26c72cc13dfebfbeed3e554382 // String | If set, returns only certificates whose public key (SPKI) matches the provided hash
};
var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.listCertificates(opts, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **active** | **Boolean**| If set, returns only active or inactive certificates | [optional] 
 **expired** | **Boolean**| If set, returns only expired or non-expired certificates | [optional] 
 **expireInDays** | **Number**| If set, returns only certificates that have already expired or expire in the specified number of days, according to the effectiveNotAfter timestamp | [optional] 
 **host** | **String**| If set, returns only certificates that are valid for the specified host, either because they contain the exact hostname or because they are wildcards and contain the parent hostname (e.g., a search for blog.example.com will match *.example.com wildcards) | [optional] 
 **spkiSha256** | **String**| If set, returns only certificates whose public key (SPKI) matches the provided hash | [optional] 

### Return type

[**ListCertsResponse**](ListCertsResponse.md)

### Authorization

[Basic HTTP Authentication](../README.md#Basic HTTP Authentication)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

<a name="retrieveACertificate"></a>
# **retrieveACertificate**
> GetCertResponse retrieveACertificate(sha256)

Returns the certificate with the given SHA256 hash

### Example
```javascript
var HardenizeOrgApi = require('hardenize_org_api');
var defaultClient = HardenizeOrgApi.ApiClient.instance;

// Configure HTTP basic authorization: Basic HTTP Authentication
var Basic HTTP Authentication = defaultClient.authentications['Basic HTTP Authentication'];
Basic HTTP Authentication.username = 'YOUR USERNAME';
Basic HTTP Authentication.password = 'YOUR PASSWORD';

var apiInstance = new HardenizeOrgApi.CertificatesApi();
var sha256 = "sha256_example"; // String | 
var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.retrieveACertificate(sha256, callback);
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **sha256** | **String**|  | 

### Return type

[**GetCertResponse**](GetCertResponse.md)

### Authorization

[Basic HTTP Authentication](../README.md#Basic HTTP Authentication)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

