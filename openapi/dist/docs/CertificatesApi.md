# HardenizeOrgApi.CertificatesApi

All URIs are relative to *https://www.hardenize.com/org/{orgLabel}/api/v0*

Method | HTTP request | Description
------------- | ------------- | -------------
[**createACertificate**](CertificatesApi.md#createACertificate) | **PUT** /certs/ | Creates a new certificate
[**listCertificates**](CertificatesApi.md#listCertificates) | **GET** /certs/ | Returns a list of your certificates
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
> ListCertsResponse listCertificates()

Returns a list of your certificates

### Example
```javascript
var HardenizeOrgApi = require('hardenize_org_api');
var defaultClient = HardenizeOrgApi.ApiClient.instance;

// Configure HTTP basic authorization: Basic HTTP Authentication
var Basic HTTP Authentication = defaultClient.authentications['Basic HTTP Authentication'];
Basic HTTP Authentication.username = 'YOUR USERNAME';
Basic HTTP Authentication.password = 'YOUR PASSWORD';

var apiInstance = new HardenizeOrgApi.CertificatesApi();
var callback = function(error, data, response) {
  if (error) {
    console.error(error);
  } else {
    console.log('API called successfully. Returned data: ' + data);
  }
};
apiInstance.listCertificates(callback);
```

### Parameters
This endpoint does not need any parameter.

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

