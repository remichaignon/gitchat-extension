var menuSelector = "div.repository-sidebar > .sunken-menu.vertical-right.repo-nav > .sunken-menu-contents > .sunken-menu-group:first-child";
var menu = $(menuSelector);

if (menu.length) {
    var containerSelector = "#js-repo-pjax-container";
    var container = $(containerSelector);
    var username = $(".header-nav-link.name").text().trim();
    var repository = window.location.href.substring(window.location.origin.length + 1).split("/").splice(0, 2).join("/");

    // Add chat
    var chatMarkup = "<div id=\"gitchat-container\" class=\"example-chat l-demo-container\" style=\"display: none;\"><header>Firebase Chat Demo</header><ul id=\"example-messages\" class=\"example-chat-messages\"></ul><footer><input type=\"text\" id=\"messageInput\"  placeholder=\"Type a message...\"></footer></div>";
    container.after(chatMarkup);

    // Add button
    var chatMenu = "<a id=\"gitchat-button\" aria-label=\"Chat\" class=\"sunken-menu-item\"><span class=\"octicon octicon-comment-discussion\"></span> <span class=\"full-word\">Chat</span></a>";
    menu.append(chatMenu);

    // Add button handler
    $("#gitchat-button").on("click", function () {
        $("#js-repo-pjax-container").hide();
        $("#gitchat-container").show();

        // CREATE A REFERENCE TO FIREBASE
        var messagesRef = new Firebase("https://git-chat.firebaseIO.com/" + repository);

        // REGISTER DOM ELEMENTS
        var messageField = $("#messageInput");
        var messageList = $("#example-messages");

        // LISTEN FOR KEYPRESS EVENT
        messageField.keypress(function (e) {
            if (e.keyCode == 13) {
                //FIELD VALUES
                var message = messageField.val();

                //SAVE DATA TO FIREBASE AND EMPTY FIELD
                messagesRef.push({name:username, text:message});
                messageField.val("");
            }
        });

        // Add a callback that is triggered for each chat message.
        messagesRef.limit(10).on("child_added", function (snapshot) {
            //GET DATA
            var data = snapshot.val();
            var username = data.name || "anonymous";
            var message = data.text;

            //CREATE ELEMENTS MESSAGE & SANITIZE TEXT
            var messageElement = $("<li>");
            var nameElement = $("<strong class=\"example-chat-username\"></strong>")
            nameElement.text(username);
            messageElement.text(message).prepend(nameElement);

            //ADD MESSAGE
            messageList.append(messageElement)

            //SCROLL TO BOTTOM OF MESSAGE LIST
            messageList[0].scrollTop = messageList[0].scrollHeight;
        });
    });
}
