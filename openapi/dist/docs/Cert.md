# HardenizeOrgApi.Cert

## Properties
Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**sha256** | **String** | Hex-encoded SHA256 hash of the certificate in DER format | 
**subject** | **String** | Subject distinguished name | 
**serial** | **String** | Hex-encoded serial number | 
**issuer** | **String** | Issuer distinguished name | 
**notBefore** | [**Date**](DateTime.md) | ISO 8601 timestamp | 
**notAfter** | [**Date**](DateTime.md) | ISO 8601 timestamp | 
**effectiveNotAfter** | [**Date**](DateTime.md) | ISO 8601 timestamp. This fields contains the time after which the certificate cannot be used in practice. For example, certificates issued from the old Symantec PKI infrastructure have been deprecated and can no longer be used for web sites, even though they are still technically valid. Depending on the deprecation phase, Symantec certificates will have the effective dates of March 1, 2018 (phase one) or September 1, 2018 (phase 2).  | 
**revokedOn** | [**Date**](DateTime.md) | Revocation timestamp, if available. | 
**keyAlg** | **String** | Private key algorithm, for example RSA or EC. | 
**keyLen** | **Number** | Private key length, for example 256 for an ECDSA key or 2048 for an RSA key. | 
**keyStrength** | **Number** | Estimated private key strength in symmetric bits. For example, a 256-bit ECDSA key is thought to provide 128 bits of security, whereas a 2048-bit RSA key provides about 112.  | 
**sigAlg** | **String** | Certificate signature algorithm. | 
**spkiSha256** | **String** | Hex-encoded SHA256 of the certificate&#39;s SPKI component | 
**hosts** | **[String]** | All hosts specified in the certificate&#39;s SAN extension. This list includes both hosts and IP addresses. Wildcard hostnames are denoted with a leading dot, but no asterisk.  | 
**caPathLen** | **Number** | Indicates if this is a CA certificate. Leaf certificates will have -1 in this field, indicating that they cannot issue further certificates. CA certificates will have 0 or a positive number. CA certificates without path length limit will have 2,147,483,647.  | 
**wildcard** | **Boolean** | Set to true if the hostname list contains at least one wildcard. | 
**selfSigned** | **Boolean** | Set to true if this is a self-signed certificate. | 
**firstSeen** | [**Date**](DateTime.md) | The first time this certificate was seen, which could be a variety of sources for example, CT, manual upload, or installed on a server.  | 
**lastSeen** | [**Date**](DateTime.md) | The last time this certificate was seen installed on a server | 
**seenInstalled** | **Boolean** | Indicates if this certificate has been seen installed on a server | 
**active** | **Boolean** | Indicates if this certificate has been seen installed recently | 
**precert** | **Boolean** | Indicates if the returned certificate is, in fact, a precertificate. | 
**managed** | **Boolean** | Indicates if this certificate is managed, i.e. provided by a third-party service that will also automatically renew the certificate when it becomes due.  | 
**ownership** | **String** | Indicates if this certificate belongs to the organisation, which means that it is served from one of the organization&#39;s properties. Do note that, in the case of certificate name mismatch, someone else&#39;s certificate may be considered as own. In that case, the **matchesOrgHost** field will be set to false.  | 
**matchesOrgHost** | **Boolean** | Indicates if at least one of the host listed in the certificates matches a hosts that belongs to the organisation.  | 
**symantecStatus** | **String** | Indicates if this certificate was issued from Symantec&#39;s PKI infrastructure.  | 
**ctRequired** | **Boolean** | Indicates whether certificate is required to be logged to CT for use on public sites. This is a requirement for all certificates issued from May 2018 onwards, as well for some earlier Symantec certificates.  | [optional] 
**ctCompliant** | **Boolean** | Indicates whether certificate embeds sufficient SCTs to satisfy CT compliance. | [optional] 
**ctLogs** | [**[CertCtLog]**](CertCtLog.md) |  | 
**pem** | **String** | Base64-encoded certificate in DER format | 


<a name="SigAlgEnum"></a>
## Enum: SigAlgEnum


* `RSAwithMD2` (value: `"RSAwithMD2"`)

* `RSAwithMD5` (value: `"RSAwithMD5"`)

* `RSAwithSHA1` (value: `"RSAwithSHA1"`)

* `RSAwithSHA256` (value: `"RSAwithSHA256"`)

* `RSAwithSHA384` (value: `"RSAwithSHA384"`)

* `RSAwithSHA512` (value: `"RSAwithSHA512"`)

* `RSAPSS` (value: `"RSAPSS"`)

* `DSAwithSHA1` (value: `"DSAwithSHA1"`)

* `DSAwithSHA256` (value: `"DSAwithSHA256"`)

* `ECDSAwithSHA1` (value: `"ECDSAwithSHA1"`)

* `ECDSAwithSHA256` (value: `"ECDSAwithSHA256"`)

* `ECDSAwithSHA384` (value: `"ECDSAwithSHA384"`)

* `ECDSAwithSHA512` (value: `"ECDSAwithSHA512"`)




<a name="OwnershipEnum"></a>
## Enum: OwnershipEnum


* `own` (value: `"own"`)

* `thirdParty` (value: `"thirdParty"`)




<a name="SymantecStatusEnum"></a>
## Enum: SymantecStatusEnum


* `notSymantec` (value: `"notSymantec"`)

* `phaseOneAffected` (value: `"phaseOneAffected"`)

* `phaseOneNotAffected` (value: `"phaseOneNotAffected"`)

* `phaseTwoAffected` (value: `"phaseTwoAffected"`)

* `phaseTwoNotAffected` (value: `"phaseTwoNotAffected"`)

* `symantecExcluded` (value: `"symantecExcluded"`)




