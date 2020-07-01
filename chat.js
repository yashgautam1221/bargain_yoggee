$(function() {
    var minValue = 3500;
    var maxValue = 5000;
    var last_input = minValue;
    var num = 0;
    const trigger = [
        "Bargain", ["OK", "ok", "Ok", "Okay", "okay", "oka", "Oka"],
        ["too high", "high", "no", "NO", "No"]

    ];

    // These are bot responses, paired in order with the above 'trigger' phrases

    const reply = [
        "Okay, Please Enter your Price", ["Great! Let's close the deal! Discount will be added to your cart."],
        ["How about ?"]
    ];

    // This is a small set of basically random 'catch alls' for anything that the user enters outside of the possible trigger phrases

    const alternative = [
        "I don't get it. Enter amount please."
    ];

    // Same purpose as the 'alternative' but an attempt at being culturally relevant ;)

    function output(input) {
        if (input.match(/^-{0,1}\d+$/)) {
            var intinput = parseInt(input);
            if (intinput >= maxValue) {
                return "Okay, Let's close the deal then!";
            } else
            if (intinput < minValue) {
                return "That will be my loss. I can't accept the deal. Little Negotiation is acceptable.";
            } else {
                num = num + 1;
                var response = ""
                var price = Math.floor(Math.floor(Math.random() * (maxValue - minValue)) + (minValue + (maxValue - minValue) / 2));
                if (intinput >= price) {
                    price = Math.floor(Math.floor(Math.random() * (maxValue - intinput)) + (price + (maxValue - price) / 2));
                    response = "I think that is low, We can give it to you at price " + price;
                }
                if (price >= maxValue) {
                    price = maxValue - (price - maxValue);
                }
                if (price <= intinput) {
                    price = maxValue;
                    response = "The best we can do is " + price;
                    return response;
                }
                console.log(maxValue);
                maxValue = price;
                last_input = intinput;
                response = "We can give it to you for " + price;
                return response;
            }

        } else {
            let product;

            //Transforms whatever the user inputs to lowercase and remove all chars except word characters, space, and digits
            let text = input.toLowerCase().replace(/[^\w\s\d]/gi, "");

            // For example 'tell me a story' becomes 'tell me story'
            // Or 'i feel happy' -> 'happy'
            text = text
                .replace(/ a /g, " ")
                .replace(/i /g, " ")
                .replace(/ i /g, " ")
                .replace(/ i/g, " ")
                .replace(/want /g, " ")
                .replace(/ want /g, " ")
                .replace(/ want/g, " ")
                .replace(/to /g, " ")
                .replace(/ to /g, " ")
                .replace(/ to/g, " ")
                .replace(/ a /g, " ")
                .replace(/i feel /g, "")
                .replace(/whats/g, "what is")
                .replace(/please /g, "")
                .replace(/ please/g, "");

            // Searches for an exact match with the 'trigger' array, if there are none, it goes will check if message contains 'coronavirus,' and if not - random alternative
            if (compare(trigger, reply, text)) {
                product = compare(trigger, reply, text);
            } else if (text.match(/coronavirus/gi)) {
                product = coronavirus[Math.floor(Math.random() * coronavirus.length)];
            } else {
                product = alternative[Math.floor(Math.random() * alternative.length)];
            }

            //update DOM
            // console.log(product);
            if (product === "How about ? ") {
                var price;
                price = Math.floor(Math.floor(Math.random() * (maxValue - last_input)) + (last_input + (maxValue - last_input) / 2));
                product = product + price;
            }
            return product;
        }
    }

    function compare(triggerArray, replyArray, string) {
        let item;
        for (let x = 0; x < triggerArray.length; x++) {
            for (let y = 0; y < replyArray.length; y++) {
                if (triggerArray[x][y] == string) {
                    items = replyArray[x];
                    item = items[Math.floor(Math.random() * items.length)];
                }
            }
        }
        return item;
    }

    var INDEX = 0;
    $("#chat-submit").click(function(e) {
        e.preventDefault();
        var msg = $("#chat-input").val();
        if (msg.trim() == '') {
            return false;
        }
        var bot = output(msg);
        generate_message(msg, 'self');
        setTimeout(function() {
            generate_message(bot, 'user');
        }, 1000)

    })

    function generate_message(msg, type) {
        INDEX++;
        var str = "";
        str += "<div id='cm-msg-" + INDEX + "' class=\"chat-msg " + type + "\">";
        // str += "          <span class=\"msg-avatar\">";
        // str += "            <img src=\"https:\/\/image.crisp.im\/avatar\/operator\/196af8cc-f6ad-4ef7-afd1-c45d5231387c\/240\/?1483361727745\">";
        // str += "          <\/span>";
        str += "          <div class=\"cm-msg-text\">";
        str += msg;
        str += "          <\/div>";
        str += "        <\/div>";
        $(".chat-logs").append(str);
        $("#cm-msg-" + INDEX).hide().fadeIn(300);
        if (type == 'self') {
            $("#chat-input").val('');
        }
        $(".chat-logs").stop().animate({ scrollTop: $(".chat-logs")[0].scrollHeight }, 1000);
    }


    $(document).delegate(".chat-btn", "click", function() {
        var value = $(this).attr("chat-value");
        var name = $(this).html();
        $("#chat-input").attr("disabled", false);
        generate_message(name, 'self');
    })

    $("#chat-circle").click(function() {
        $("#chat-circle").toggle('scale');
        $(".chat-box").toggle('scale');
    })

    $(".chat-box-toggle").click(function() {
        $("#chat-circle").toggle('scale');
        $(".chat-box").toggle('scale');
    })

})