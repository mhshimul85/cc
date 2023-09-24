var data,
  loan_amount,
  __loan_amount,
  total_payment = 0,
  total_time = 0,
  total_interest_paid = 0,
  loan_interest_rate,
  loan_processing_fee,
  daily_interest_rate,
  paymentsLength,
  final_amount,
  details,
  result,
  main_array = [];

$(document).ready(function () {
  function data() {
    loan_amount = $(".loan_amount").val() * 1;
    // __loan_amount = loan_amount;
    // total_payment = 0;
    // total_time = 0;
    loan_interest_rate = ($(".loan_interest_rate").val() * 1) / 100;
    daily_interest_rate = loan_interest_rate / 365;
    loan_processing_fee = $(".loan_processing_fee").val() * 1;
    paymentsLength = $(".payments > *").length;
    // details = $(".details");
    // result = $(".result");
    // final_amount = $(".final_amount");

    console.log(
      `loan_amount: ${loan_amount}, loan_interest_rate: ${loan_interest_rate}, loan_processing_fee: ${loan_processing_fee}, daily_interest_rate: ${daily_interest_rate},`
    );
  }

  function complex_interest(principle, interest_rate, number_of_year) {
    return principle * Math.pow(1 + interest_rate, number_of_year) - principle;
  }

  function output() {
    data();
    $(".details").html(
      `<p>Loan Amount: ${loan_amount}</p><p>Interest Rate: ${
        loan_interest_rate * 100
      }%</p><p>Processing Fee: ${loan_processing_fee}</p><p>Total paid: ${(
        total_payment + loan_processing_fee
      ).toFixed(2)}</p><p>Total Interest paid: ${total_interest_paid.toFixed(
        2
      )}(${((total_interest_paid / loan_amount) * 100).toFixed(
        2
      )}% within ${total_time} Days.)</p>`
    );
  }

  function calc() {
    data();
    __loan_amount = loan_amount;
    total_payment = 0;
    total_interest_paid = 0;
    total_time = 0;
    main_array = [];
    // console.log(paymentsLength);
    for (let i = 1; i <= paymentsLength; i++) {
      let days_after =
        $(`.payments > p:nth-child(${i})`)
          .find(".payments_installment_days_after")
          .val() * 1;
      let amount =
        $(`.payments > p:nth-child(${i})`)
          .find(".payments_installment_amount")
          .val() * 1;
      main_array.push({
        days_after: days_after,
        amount: amount,
      });
    }
    for (let i = 1; i <= main_array.length; i++) {
      total_interest_paid += complex_interest(
        __loan_amount,
        daily_interest_rate,
        main_array[i - 1].days_after
      );
      __loan_amount =
        __loan_amount +
        complex_interest(
          __loan_amount,
          daily_interest_rate,
          main_array[i - 1].days_after
        ) -
        main_array[i - 1].amount;
      total_payment += main_array[i - 1].amount;
      total_time += main_array[i - 1].days_after;
    }
    console.table(main_array);
    output();
  }

  console.log(`${$(".loan > *").length} ${$(".payments > *").length}`);

  $(".final_amount").click(function () {
    data();
    if (paymentsLength == 1) {
      __loan_amount = loan_amount;
    }

    let days_after =
      $(`.payments > p:nth-child(${paymentsLength})`)
        .find(".payments_installment_days_after")
        .val() * 1;

    let final_amount =
      complex_interest(__loan_amount, daily_interest_rate, days_after) +
      __loan_amount;

    $(`.payments > p:nth-child(${paymentsLength})`)
      .find(".payments_installment_amount")
      .val(final_amount);

    calc();

    $(".add").hide();
    $(".remove_item").hide();
    $(this).hide();
    // console.log(days_after + " " + final_amount);
  });

  $(".add").click(function () {
    var text = `<p>
    <input
      class="payments_installment_days_after"
      name="payments_installment_days_after"
      type="number"
      min="0"
      placeholder="Days After"
    />
    <input
      class="payments_installment_amount"
      name="payments_installment_amount"
      type="number"
      min="0"
      placeholder="Amount"
    /><span class="remove_item" onClick="this.parentNode.remove();"> (X) </span>
  </p>`;
    // data();
    $(".payments").append(text);
    // console.log($(".payments > *").length);
  });

  $(".payments").on("DOMSubtreeModified", function () {
    calc();
  });

  //   $(".payments").change(function () {
  //     alert("Changed");
  //     console.log("Changed");
  //   });
});
