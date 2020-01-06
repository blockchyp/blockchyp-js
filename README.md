
# BlockChyp JavaScript SDK

[![Build Status](https://circleci.com/gh/blockchyp/blockchyp-js/tree/master.svg?style=shield)](https://circleci.com/gh/blockchyp/blockchyp-js/tree/master)
[![NPM](https://img.shields.io/npm/v/@blockchyp/blockchyp-js)](https://www.npmjs.com/package/@blockchyp/blockchyp-js)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/blockchyp/blockchyp-js/blob/master/LICENSE)

This is the SDK for JavaScript.  Like all BlockChyp SDK's, it provides a full
client for the BlockChyp gateway and BlockChyp payment terminals.

This SDK is designed to run in a browser or in Node.js.  But given that this library
is designed for direct communication with the gateway and terminals, in browser
use is not recommended because API credentials would be discoverable via browser
developer tools.  There are legitimate use cases for in browser use, but they're rare.

## Browser Based Integrations

This library is designed primarily server side use via Node.js.  BlockChyp provides
a separate library for public facing web side or e-commerce systems.  The BlockChyp
Web Tokenizer uses cross-origin iframes to tokenize payments in the browser, keeping
web based applications out of PCI scope.

[BlockChyp Web Tokenizer on GitHub](https://github.com/blockchyp/blockchyp-tokenizer)

## Installation

The BlockChyp SDK is installable via NPM.  Type the following command to add
BlockChyp to your package.json.

```
npm install @blockchyp/blockchyp-js --save
```

## A Simple Example

Running your first transaction is easy.  Make sure you have a BlockChyp terminal,
activate it, and generate a set of API keys.




## The Rest APIs

All BlockChyp SDKs provide a convenient way of accessing the BlockChyp REST APIs.
You can checkout the REST API documentation via the links below.

[Terminal REST API Docs](https://docs.blockchyp.com/rest-api/terminal/index.html)

[Gateway REST API Docs](https://docs.blockchyp.com/rest-api/gateway/index.html)

## Other SDKs

BlockChyp has officially supported SDKs for eight different development platforms and counting.
Here's the full list with links to their GitHub repositories.

[Go SDK](https://github.com/blockchyp/blockchyp-go)

[Node.js/JavaScript SDK](https://github.com/blockchyp/blockchyp-js)

[Java SDK](https://github.com/blockchyp/blockchyp-java)

[.net/C# SDK](https://github.com/blockchyp/blockchyp-csharp)

[Ruby SDK](https://github.com/blockchyp/blockchyp-ruby)

[PHP SDK](https://github.com/blockchyp/blockchyp-php)

[Python SDK](https://github.com/blockchyp/blockchyp-python)

[iOS (Objective-C/Swift) SDK](https://github.com/blockchyp/blockchyp-ios)

## Getting a Developer Kit

In order to test your integration with real terminals, you'll need a BlockChyp
Developer Kit.  Our kits include a fully functioning payment terminal with
test pin encryption keys.  Every kit includes a comprehensive set of test
cards with test cards for every major card brand and entry method, including
Contactless and Contact EMV and mag stripe cards.  Each kit also includes
test gift cards for our blockchain gift card system.

Access to BlockChyp's developer program is currently invite only, but you
can request an invitation by contacting our engineering team at **nerds@blockchyp.com**.

You can also view a number of long form demos and learn more about us on our [YouTube Channel](https://www.youtube.com/channel/UCE-iIVlJic_XArs_U65ZcJg).

## Transaction Code Examples

You don't want to read words. You want examples. Here's a quick rundown of the
stuff you can do with the BlockChyp JavaScript SDK and a few basic examples.

#### Charge

Executes a standard direct preauth and capture.

```javascript
  let BlockChyp = require("BlockChyp");

  let client = BlockChyp.newClient({
      apiKey:      "ZDSMMZLGRPBPRTJUBTAFBYZ33Q",
      bearerToken: "ZLBW5NR4U5PKD5PNP3ZP3OZS5U",
      signingKey:  "9c6a5e8e763df1c9256e3d72bd7f53dfbd07312938131c75b3bfd254da787947"
    });

  // setup request object
  request = {
      test: true,
      terminalName: "Test Terminal",
      amount: "55.00",
  }

  response = client.charge(request)


  //process the result
  if (response.approved) {
    console.log("Approved");
  }

  console.log(response.authCode);
  console.log(response.authorizedAmount);



```

#### Preauthorization

Executes a preauthorization intended to be captured later.

```javascript
  let BlockChyp = require("BlockChyp");

  let client = BlockChyp.newClient({
      apiKey:      "ZDSMMZLGRPBPRTJUBTAFBYZ33Q",
      bearerToken: "ZLBW5NR4U5PKD5PNP3ZP3OZS5U",
      signingKey:  "9c6a5e8e763df1c9256e3d72bd7f53dfbd07312938131c75b3bfd254da787947"
    });

  // setup request object
  request = {
      test: true,
      terminalName: "Test Terminal",
      amount: "27.00",
  }

  response = client.preauth(request)


  //process the result
  if (response.approved) {
    console.log("Approved");
  }

  console.log(response.authCode);
  console.log(response.authorizedAmount);



```

#### Terminal Ping

Tests connectivity with a payment terminal.

```javascript
  let BlockChyp = require("BlockChyp");

  let client = BlockChyp.newClient({
      apiKey:      "ZDSMMZLGRPBPRTJUBTAFBYZ33Q",
      bearerToken: "ZLBW5NR4U5PKD5PNP3ZP3OZS5U",
      signingKey:  "9c6a5e8e763df1c9256e3d72bd7f53dfbd07312938131c75b3bfd254da787947"
    });

  // setup request object
  request = {
      terminalName: "Test Terminal",
  }

  response = client.ping(request)


  //process the result
  if (response.success) {
    console.log("Success");
  }




```

#### Balance

Checks the remaining balance on a payment method.

```javascript
  let BlockChyp = require("BlockChyp");

  let client = BlockChyp.newClient({
      apiKey:      "ZDSMMZLGRPBPRTJUBTAFBYZ33Q",
      bearerToken: "ZLBW5NR4U5PKD5PNP3ZP3OZS5U",
      signingKey:  "9c6a5e8e763df1c9256e3d72bd7f53dfbd07312938131c75b3bfd254da787947"
    });

  // setup request object
  request = {
      test: true,
      terminalName: "Test Terminal",
      cardType: CardType.EBT,
  }

  response = client.balance(request)


  //process the result
  if (response.success) {
    console.log("Success");
  }




```

#### Terminal Clear

Clears the line item display and any in progress transaction.

```javascript
  let BlockChyp = require("BlockChyp");

  let client = BlockChyp.newClient({
      apiKey:      "ZDSMMZLGRPBPRTJUBTAFBYZ33Q",
      bearerToken: "ZLBW5NR4U5PKD5PNP3ZP3OZS5U",
      signingKey:  "9c6a5e8e763df1c9256e3d72bd7f53dfbd07312938131c75b3bfd254da787947"
    });

  // setup request object
  request = {
      test: true,
      terminalName: "Test Terminal",
  }

  response = client.clear(request)


  //process the result
  if (response.success) {
    console.log("Success");
  }




```

#### Terms & Conditions Capture

Prompts the user to accept terms and conditions.

```javascript
  let BlockChyp = require("BlockChyp");

  let client = BlockChyp.newClient({
      apiKey:      "ZDSMMZLGRPBPRTJUBTAFBYZ33Q",
      bearerToken: "ZLBW5NR4U5PKD5PNP3ZP3OZS5U",
      signingKey:  "9c6a5e8e763df1c9256e3d72bd7f53dfbd07312938131c75b3bfd254da787947"
    });

  // setup request object
  request = {
      test: true,
      terminalName: "Test Terminal",

      // Alias for a Terms and Conditions template configured in the BlockChyp
      // dashboard.
      tcAlias: "hippa",

      // Name of the contract or document if not using an alias.
      tcName: "HIPPA Disclosure",

      // Full text of the contract or disclosure if not using an alias.
      tcContent: "Full contract text",

      // File format for the signature image.
      sigFormat: SignatureFormat.PNG,

      // Width of the signature image in pixels.
      sigWidth: 200,

      // Whether or not a signature is required. Defaults to true.
      sigRequired: true,
  }

  response = client.termsAndConditions(request)


  //process the result
  if (response.success) {
    console.log("Success");
  }

  console.log(response.sig);
  console.log(response.sigFile);



```

#### Update Transaction Display

Appends items to an existing transaction display Subtotal, Tax, and Total are
overwritten by the request. Items with the same description are combined into
groups.

```javascript
  let BlockChyp = require("BlockChyp");

  let client = BlockChyp.newClient({
      apiKey:      "ZDSMMZLGRPBPRTJUBTAFBYZ33Q",
      bearerToken: "ZLBW5NR4U5PKD5PNP3ZP3OZS5U",
      signingKey:  "9c6a5e8e763df1c9256e3d72bd7f53dfbd07312938131c75b3bfd254da787947"
    });

  // setup request object
  request = {
      test: true,
      terminalName: "Test Terminal",
      transaction:   {
      subtotal: "60.00",
      tax: "5.00",
      total: "65.00",
      items: [
        {
          description: "Leki Trekking Poles",
          price: "35.00",
          quantity: 2,
          extended: "70.00",
          discounts: [
          {
            description: "memberDiscount",
            amount: "10.00",
  	    },
	    ],
  	  },
	  ],
  },
  }

  response = client.updateTransactionDisplay(request)


  //process the result
  if (response.success) {
    console.log("Succeded");
  }




```

#### New Transaction Display

Displays a new transaction on the terminal.

```javascript
  let BlockChyp = require("BlockChyp");

  let client = BlockChyp.newClient({
      apiKey:      "ZDSMMZLGRPBPRTJUBTAFBYZ33Q",
      bearerToken: "ZLBW5NR4U5PKD5PNP3ZP3OZS5U",
      signingKey:  "9c6a5e8e763df1c9256e3d72bd7f53dfbd07312938131c75b3bfd254da787947"
    });

  // setup request object
  request = {
      test: true,
      terminalName: "Test Terminal",
      transaction:   {
      subtotal: "60.00",
      tax: "5.00",
      total: "65.00",
      items: [
        {
          description: "Leki Trekking Poles",
          price: "35.00",
          quantity: 2,
          extended: "70.00",
          discounts: [
          {
            description: "memberDiscount",
            amount: "10.00",
  	    },
	    ],
  	  },
	  ],
  },
  }

  response = client.newTransactionDisplay(request)


  //process the result
  if (response.success) {
    console.log("Succeded");
  }




```

#### Text Prompt

Asks the consumer text based question.

```javascript
  let BlockChyp = require("BlockChyp");

  let client = BlockChyp.newClient({
      apiKey:      "ZDSMMZLGRPBPRTJUBTAFBYZ33Q",
      bearerToken: "ZLBW5NR4U5PKD5PNP3ZP3OZS5U",
      signingKey:  "9c6a5e8e763df1c9256e3d72bd7f53dfbd07312938131c75b3bfd254da787947"
    });

  // setup request object
  request = {
      test: true,
      terminalName: "Test Terminal",

      // Type of prompt. Can be 'email', 'phone', 'customer-number', or
      // 'rewards-number'.
      promptType: PromptType.EMAIL,
  }

  response = client.textPrompt(request)


  //process the result
  if (response.success) {
    console.log("Success");
  }

  console.log(response.response);



```

#### Boolean Prompt

Asks the consumer a yes/no question.

```javascript
  let BlockChyp = require("BlockChyp");

  let client = BlockChyp.newClient({
      apiKey:      "ZDSMMZLGRPBPRTJUBTAFBYZ33Q",
      bearerToken: "ZLBW5NR4U5PKD5PNP3ZP3OZS5U",
      signingKey:  "9c6a5e8e763df1c9256e3d72bd7f53dfbd07312938131c75b3bfd254da787947"
    });

  // setup request object
  request = {
      test: true,
      terminalName: "Test Terminal",
      prompt: "Would you like to become a member?",
      yesCaption: "Yes",
      noCaption: "No",
  }

  response = client.booleanPrompt(request)


  //process the result
  if (response.success) {
    console.log("Success");
  }

  console.log(response.response);



```

#### Display Message

Displays a short message on the terminal.

```javascript
  let BlockChyp = require("BlockChyp");

  let client = BlockChyp.newClient({
      apiKey:      "ZDSMMZLGRPBPRTJUBTAFBYZ33Q",
      bearerToken: "ZLBW5NR4U5PKD5PNP3ZP3OZS5U",
      signingKey:  "9c6a5e8e763df1c9256e3d72bd7f53dfbd07312938131c75b3bfd254da787947"
    });

  // setup request object
  request = {
      test: true,
      terminalName: "Test Terminal",
      message: "Thank you for your business.",
  }

  response = client.message(request)


  //process the result
  if (response.success) {
    console.log("Success");
  }




```

#### Refund

Executes a refund.

```javascript
  let BlockChyp = require("BlockChyp");

  let client = BlockChyp.newClient({
      apiKey:      "ZDSMMZLGRPBPRTJUBTAFBYZ33Q",
      bearerToken: "ZLBW5NR4U5PKD5PNP3ZP3OZS5U",
      signingKey:  "9c6a5e8e763df1c9256e3d72bd7f53dfbd07312938131c75b3bfd254da787947"
    });

  // setup request object
  request = {
      terminalName: "Test Terminal",
      transactionId: "<PREVIOUS TRANSACTION ID>",

      // Optional amount for partial refunds.
      amount: "5.00",
  }

  response = client.refund(request)


  //process the result
  if (response.approved) {
    console.log("Approved");
  }




```

#### Enroll

Adds a new payment method to the token vault.

```javascript
  let BlockChyp = require("BlockChyp");

  let client = BlockChyp.newClient({
      apiKey:      "ZDSMMZLGRPBPRTJUBTAFBYZ33Q",
      bearerToken: "ZLBW5NR4U5PKD5PNP3ZP3OZS5U",
      signingKey:  "9c6a5e8e763df1c9256e3d72bd7f53dfbd07312938131c75b3bfd254da787947"
    });

  // setup request object
  request = {
      test: true,
      terminalName: "Test Terminal",
  }

  response = client.enroll(request)


  //process the result
  if (response.approved) {
    console.log("Approved");
  }

  console.log(response.token);



```

#### Gift Card Activation

Activates or recharges a gift card.

```javascript
  let BlockChyp = require("BlockChyp");

  let client = BlockChyp.newClient({
      apiKey:      "ZDSMMZLGRPBPRTJUBTAFBYZ33Q",
      bearerToken: "ZLBW5NR4U5PKD5PNP3ZP3OZS5U",
      signingKey:  "9c6a5e8e763df1c9256e3d72bd7f53dfbd07312938131c75b3bfd254da787947"
    });

  // setup request object
  request = {
      test: true,
      terminalName: "Test Terminal",
      amount: "50.00",
  }

  response = client.giftActivate(request)


  //process the result
  if (response.approved) {
    console.log("Approved");
  }

  console.log(response.amount);
  console.log(response.currentBalance);
  console.log(response.publicKey);



```

#### Time Out Reversal

Executes a manual time out reversal.

We love time out reversals. Don't be afraid to use them whenever a request to a
BlockChyp terminal times out. You have up to two minutes to reverse any
transaction. The only caveat is that you must assign transactionRef values when
you build the original request. Otherwise, we have no real way of knowing which
transaction you're trying to reverse because we may not have assigned it an id
yet. And if we did assign it an id, you wouldn't know what it is because your
request to the terminal timed out before you got a response.

```javascript
  let BlockChyp = require("BlockChyp");

  let client = BlockChyp.newClient({
      apiKey:      "ZDSMMZLGRPBPRTJUBTAFBYZ33Q",
      bearerToken: "ZLBW5NR4U5PKD5PNP3ZP3OZS5U",
      signingKey:  "9c6a5e8e763df1c9256e3d72bd7f53dfbd07312938131c75b3bfd254da787947"
    });

  // setup request object
  request = {
      terminalName: "Test Terminal",
      transactionRef: "<LAST TRANSACTION REF>",
  }

  response = client.reverse(request)


  //process the result
  if (response.approved) {
    console.log("Approved");
  }




```

#### Capture Preauthorization

Captures a preauthorization.

```javascript
  let BlockChyp = require("BlockChyp");

  let client = BlockChyp.newClient({
      apiKey:      "ZDSMMZLGRPBPRTJUBTAFBYZ33Q",
      bearerToken: "ZLBW5NR4U5PKD5PNP3ZP3OZS5U",
      signingKey:  "9c6a5e8e763df1c9256e3d72bd7f53dfbd07312938131c75b3bfd254da787947"
    });

  // setup request object
  request = {
      test: true,
      transactionId: "<PREAUTH TRANSACTION ID>",
  }

  response = client.capture(request)


  //process the result
  if (response.approved) {
    console.log("Approved");
  }




```

#### Close Batch

Closes the current credit card batch.

```javascript
  let BlockChyp = require("BlockChyp");

  let client = BlockChyp.newClient({
      apiKey:      "ZDSMMZLGRPBPRTJUBTAFBYZ33Q",
      bearerToken: "ZLBW5NR4U5PKD5PNP3ZP3OZS5U",
      signingKey:  "9c6a5e8e763df1c9256e3d72bd7f53dfbd07312938131c75b3bfd254da787947"
    });

  // setup request object
  request = {
      test: true,
  }

  response = client.closeBatch(request)


  //process the result
  if (response.success) {
    console.log("Success");
  }

  console.log(response.capturedTotal);
  console.log(response.openPreauths);



```

#### Void Transaction

Discards a previous preauth transaction.

```javascript
  let BlockChyp = require("BlockChyp");

  let client = BlockChyp.newClient({
      apiKey:      "ZDSMMZLGRPBPRTJUBTAFBYZ33Q",
      bearerToken: "ZLBW5NR4U5PKD5PNP3ZP3OZS5U",
      signingKey:  "9c6a5e8e763df1c9256e3d72bd7f53dfbd07312938131c75b3bfd254da787947"
    });

  // setup request object
  request = {
      test: true,
      transactionId: "<PREVIOUS TRANSACTION ID>",
  }

  response = client.void(request)


  //process the result
  if (response.approved) {
    console.log("Approved");
  }




```

## Running Integration Tests

If you'd like to run the integration tests, create a new file on your system
called `sdk-itest-config.json` with the API credentials you'll be using as
shown in the example below.

```
{
 "gatewayHost": "https://api.blockchyp.com",
 "testGatewayHost": "https://test.blockchyp.com",
 "apiKey": "PZZNEFK7HFULCB3HTLA7HRQDJU",
 "bearerToken": "QUJCHIKNXOMSPGQ4QLT2UJX5DI",
 "signingKey": "f88a72d8bc0965f193abc7006bbffa240663c10e4d1dc3ba2f81e0ca10d359f5"
}
```

This file can be located in a few different places, but is usually located
at `<USER_HOME>/.config/blockchyp/sdk-itest-config.json`.  All BlockChyp SDK's
use the same configuration file.

To run the integration test suite via `make`, type the following command:

`make integration`


## Running Integration Tests With Jasmine

If you'd like to bypass make and run the integration test suite directly,
use the following command:

`BC_TEST_DELAY=5 jasmine itest/*Spec.js`

If you'd like to run individual tests, try the following command:

`jasmine itest/TerminalChargeITestSpec.js`

## Contributions

BlockChyp welcomes contributions from the open source community, but bear in mind
that this repository has been generated by our internal SDK Generator tool.  If
we choose to accept a PR or contribution, your code will be moved into our SDK
Generator project, which is a private repository.

## License

Copyright BlockChyp, Inc., 2019

Distributed under the terms of the [MIT] license, blockchyp-js is free and open source software.

[MIT]: https://github.com/blockchyp/blockchyp-js/blob/master/LICENSE
