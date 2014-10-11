var menuSelector = "div.repository-sidebar > .sunken-menu.vertical-right.repo-nav > .sunken-menu-contents > .sunken-menu-group:first-child";
var menu = $(menuSelector);

if (menu.length) {
    var containerSelector = "#js-repo-pjax-container";
    var container = $(containerSelector);
    var usernameSelector = ".header-nav-link.name";
    var username = $(usernameSelector).text().trim();
    var repository = window.location.href.substring(window.location.origin.length + 1).split("/").splice(0, 2).join("/");

    // Add chat
    var chatContainer =
        "<div id=\"discussion_bucket\" class=\"tab-content clearfix pull-request-tab-content is-visible\">" +
        "  <div class=\"discussion-timeline pull-discussion-timeline\">" +
        "    <div class=\"timeline-comment-wrapper timeline-new-comment\">" +
        "      <form accept-charset=\"UTF-8\">" +
        "        <div class=\"timeline-comment\">" +
        "          <div class=\"previewable-comment-form write-selected\">" +
        "            <div class=\"comment-form-head tabnav\">" +
        "            </div>" +
        "            <div class=\"write-content is-default\">" +
        "              <textarea name=\"comment[body]\" tabindex=\"1\" id=\"new_comment_field\" placeholder=\"Leave a comment\" class=\"input-contrast comment-form-textarea\"></textarea>" +
        "          </div>" +
        "        </div>" +
        "      </div>" +
        "      <div class=\"form-actions\">" +
        "        <div id=\"partial-new-comment-form-actions\">" +
        "          <button type=\"submit\" class=\"button primary\" tabindex=\"2\" data-disable-with=\"\" data-disable-invalid=\"\">" +
        "            Comment" +
        "          </button>" +
        "        </div>" +
        "      </form>" +
        "    </div>" +
        "  </div>" +
        "</div>";

    var chatMarkup =
        "<div id=\"gitchat-container\" class=\"\" style=\"display: none;\">" +
        "    <header>Firebase Chat Demo</header>" +
        "    <ul id=\"example-messages\" class=\"\"></ul>" +
        "    <footer>" +
        "        <input type=\"text\" id=\"messageInput\"  placeholder=\"Type a message...\">" +
        "    </footer>" +
        "</div>";
    container.after(chatMarkup);

    // Add button
    var chatButton =
        "<a id=\"gitchat-button\" aria-label=\"Chat\" class=\"sunken-menu-item\">" +
        "    <span class=\"octicon octicon-comment-discussion\"></span>" +
        "    <span class=\"full-word\">Chat</span>" +
        "</a>";
    menu.append(chatButton);

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
            var messageHTML =
                "<div class=\"timeline-comment-wrapper\">" +
                "  <div class=\"timeline-comment-header\">" +
                "    <div class=\"timeline-comment-actions\">" +
                "      <a class=\"timeline-comment-action delete-button\" title=\"Delete message\" aria-label=\"Delete message\">" +
                "        <span class=\"octicon octicon-x\"></span>" +
                "      </a>" +
                "    </div>" +
                "    <div class=\"timeline-comment-header-text\">" +
                "      <strong>" +
                "        <a href=\"/" + username + "\" class=\"author\">" + username + "</a>" +
                "      </strong>" +
                "    </div>" +
                "  </div>" +
                "  <div class=\"comment-content\">" +
                "    <div class=\"edit-comment-hide\">" +
                "      <div class=\"comment-body markdown-body markdown-format\">" +
                "          <p>" + message + "</p>" +
                "      </div>" +
                "    </div>" +
                "  </div>" +
                "</div>"

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
