BlockChyp is still in development and this library cannot be used without BlockChyp payment terminals or gateway credentials - which are currently available
by invitation only.  Visit <https://www.blockchyp.com> for more information.

# BlockChyp JavaScript Client

Provides simplified integration with the BlockChyp gateway and BlockChyp Payment
Terminals for node and browser based JavaScript developers.

## Features

This client library includes ES6 components for direct use or minified JavaScript libraries with all dependencies included.

* ES6 Components
* Minified JavaScript Library For In Browser Use
* Support for POS network fallback encryption.
* Support for dynamic terminal IP addresses.
* EMV, Mag Stripe, and Contactless card support.
* Direct Sale / Purchase
* Preauth and Capture

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
      test: true 
      terminalName: "Test Terminal" 
      amount: "55.00" 
  }

  response, err := client.charge(request)


  //process the result
  if response.approved {
    console.log("Approved")
  }

  console.log(response.{authCode string})
  console.log(response.{authorizedAmount string})



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
      test: true 
      terminalName: "Test Terminal" 
      amount: "27.00" 
  }

  response, err := client.preauth(request)


  //process the result
  if response.approved {
    console.log("Approved")
  }

  console.log(response.{authCode string})
  console.log(response.{authorizedAmount string})



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
      terminalName: "Test Terminal" 
  }

  response, err := client.ping(request)


  //process the result
  if response.success {
    console.log("Success")
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
      test: true 
      terminalName: "Test Terminal" 
      cardType: 2 
  }

  response, err := client.balance(request)


  //process the result
  if response.success {
    console.log("Success")
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
      test: true 
      terminalName: "Test Terminal" 
  }

  response, err := client.clear(request)


  //process the result
  if response.success {
    console.log("Success")
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
      test: true 
      terminalName: "Test Terminal" 
      tcAlias: "hippa"  // Alias for a T&C template configured in blockchyp.
      tcName: "HIPPA Disclosure"  // Name of the contract or document if not using an alias.
      tcContent: "Full contract text"  // Full text of the contract or disclosure if not using an alias.
      sigFormat: "png"  // file format for the signature image, if desired can be PNG or JPG.
      sigWidth: 200  // width of the signature image in pixels.
      sigRequired: true  // Whether or not a signature is required. Defaults to true.
  }

  response, err := client.termsAndConditions(request)


  //process the result
  if response.success {
    console.log("Success")
  }

  console.log(response.{sig string})
  console.log(response.{sigFile string})



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
      test: true 
      terminalName: "Test Terminal" 
      transaction:   {
      subtotal: "60.00" ,
      tax: "5.00" ,
      total: "65.00" ,
      items: [
        {
          description: "Leki Trekking Poles" ,
          price: "35.00" ,
          quantity: 2 ,
          extended: "70.00" ,
          discounts: [
          {
            description: "memberDiscount" ,
            amount: "10.00" ,
  	    },
	    ],
  	  },
	  ],
  }
  }

  response, err := client.updateTransactionDisplay(request)


  //process the result
  if response.success {
    console.log("Succeded")
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
      test: true 
      terminalName: "Test Terminal" 
      transaction:   {
      subtotal: "60.00" ,
      tax: "5.00" ,
      total: "65.00" ,
      items: [
        {
          description: "Leki Trekking Poles" ,
          price: "35.00" ,
          quantity: 2 ,
          extended: "70.00" ,
          discounts: [
          {
            description: "memberDiscount" ,
            amount: "10.00" ,
  	    },
	    ],
  	  },
	  ],
  }
  }

  response, err := client.newTransactionDisplay(request)


  //process the result
  if response.success {
    console.log("Succeded")
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
      test: true 
      terminalName: "Test Terminal" 
      promptType: "email"  // Type of prompt. Can be 'email', 'phone', 'customer-number', or 'rewards-number'.
  }

  response, err := client.textPrompt(request)


  //process the result
  if response.success {
    console.log("Success")
  }

  console.log(response.{response string})



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
      test: true 
      terminalName: "Test Terminal" 
      prompt: "Would you like to become a member?" 
      yesCaption: "Yes" 
      noCaption: "No" 
  }

  response, err := client.booleanPrompt(request)


  //process the result
  if response.success {
    console.log("Success")
  }

  console.log(response.{response bool})



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
      test: true 
      terminalName: "Test Terminal" 
      message: "Thank you for your business." 
  }

  response, err := client.message(request)


  //process the result
  if response.success {
    console.log("Success")
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
      terminalName: "Test Terminal" 
      transactionId: "<PREVIOUS TRANSACTION ID>" 
      amount: "5.00"  // Optional amount for partial refunds.
  }

  response, err := client.refund(request)


  //process the result
  if response.approved {
    console.log("Approved")
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
      test: true 
      terminalName: "Test Terminal" 
  }

  response, err := client.enroll(request)


  //process the result
  if response.approved {
    console.log("Approved")
  }

  console.log(response.{token string})



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
      test: true 
      terminalName: "Test Terminal" 
      amount: "50.00" 
  }

  response, err := client.giftActivate(request)


  //process the result
  if response.approved {
    console.log("Approved")
  }

  console.log(response.{amount string})
  console.log(response.{currentBalance string})
  console.log(response.{publicKey string})



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
      terminalName: "Test Terminal" 
      transactionRef: "<LAST TRANSACTION REF>" 
  }

  response, err := client.reverse(request)


  //process the result
  if response.approved {
    console.log("Approved")
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
      test: true 
      transactionId: "<PREAUTH TRANSACTION ID>" 
  }

  response, err := client.capture(request)


  //process the result
  if response.approved {
    console.log("Approved")
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
      test: true 
  }

  response, err := client.closeBatch(request)


  //process the result
  if response.success {
    console.log("Success")
  }

  console.log(response.{capturedTotal string})
  console.log(response.{openPreauths string})



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
      test: true 
      transactionId: "<PREVIOUS TRANSACTION ID>" 
  }

  response, err := client.void(request)


  //process the result
  if response.approved {
    console.log("Approved")
  }




```

## Contributions

BlockChyp welcomes contributions from the open source community, but bear in mind
that this repository has been generated by our internal SDK Generator tool.  If
we choose to accept a PR or contribution, your code will be moved into our SDK
Generator project, which is a private repository.

## License

Copyright BlockChyp, Inc., 2019

Distributed under the terms of the [MIT] license, blockchyp-js is free and open source software.

[MIT]: https://github.com/blockchyp/blockchyp-js/blob/master/LICENSE
