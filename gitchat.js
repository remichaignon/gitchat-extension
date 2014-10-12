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
        "<div id=\"gitchat-container\" style=\"display: none;\">" +
        "  <div id=\"discussion_bucket\" class=\"tab-content clearfix pull-request-tab-content is-visible\">" +
        "    <div class=\"discussion-timeline pull-discussion-timeline\">" +
        "      <div id=\"gitchat-message-list\"></div>" +
        "      <div class=\"timeline-comment-wrapper timeline-new-comment\">" +
        "        <form accept-charset=\"UTF-8\">" +
        "          <div class=\"timeline-comment\">" +
        "            <div class=\"previewable-comment-form write-selected\">" +
        "              <div class=\"comment-form-head tabnav\">" +
        "                <ul class=\"tabnav-tabs\">" +
        "                  <li><a href=\"#\" class=\"tabnav-tab write-tab js-write-tab selected\">Write</a></li>" +
        "                </ul>" +
        "              </div>" +
        "              <div class=\"write-content is-default\">" +
        "                <textarea name=\"comment[body]\" tabindex=\"1\" id=\"new_comment_field\" placeholder=\"Leave a comment\" class=\"input-contrast comment-form-textarea\"></textarea>" +
        "              </div>" +
        "            </div>" +
        "            <div class=\"form-actions\">" +
        "              <div id=\"partial-new-comment-form-actions\">" +
        "                <button id=\"gitchat-submit\" type=\"submit\" class=\"button primary\" tabindex=\"2\">" +
        "                  Comment" +
        "                </button>" +
        "              </div>" +
        "            </div>" +
        "          </div>" +
        "        </form>" +
        "      </div>" +
        "    </div>" +
        "  </div>" +
        "</div>";
    container.after(chatContainer);

    // Add button
    var chatButton =
        "<a id=\"gitchat-button\" aria-label=\"Chat\" class=\"sunken-menu-item\">" +
        "    <span class=\"octicon octicon-comment-discussion\"></span>" +
        "    <span class=\"full-word\">Chat</span>" +
        "</a>";
    menu.append(chatButton);

    // Add button handler
    $("#gitchat-button").on("click", function () {
        // Hide regular content and show chat
        $("#js-repo-pjax-container").hide();
        $("#gitchat-container").show();

        // Select correct tab
        $(".sunken-menu-group > li > a.selected").removeClass("selected");
        $("#gitchat-button").addClass("selected");

        // Create reference to firebase
        var messagesRef = new Firebase("https://git-chat.firebaseIO.com/" + repository);

        // Submit message
        var submitMessage = function () {
            var message = messageField.val();

            // Save message to firebase and reset field
            messagesRef.push({ name:username, text:message });
            messageField.val("");
        };

        // Submit message when pressing enter or clicking button
        var messageField = $("#new_comment_field");
        messageField.keypress(function (e) {
            if (e.keyCode == 13) {
                submitMessage();
            }
        });
        var messageSubmit = $("#gitchat-submit");
        messageSubmit.on("click", function (e) {
            e.preventDefault();

            submitMessage();
        });

        // Add a callback that is triggered for each chat message.
        messagesRef.limit(20).on("child_added", function (snapshot) {
            // Get data
            var data = snapshot.val();
            var username = data.name || "anonymous";
            var message = data.text;

            // Create message element
            var messageHTML =
                "<div class=\"timeline-comment-wrapper\">" +
                "  <div class=\"comment timeline-comment is-task-list-enabled\">" +
                "    <div class=\"timeline-comment-header\">" +
                "      <div class=\"timeline-comment-header-text\">" +
                "        <strong>" +
                "          <a href=\"/" + username + "\" class=\"author\">" + username + "</a>" +
                "        </strong>" +
                "      </div>" +
                "    </div>" +
                "    <div class=\"comment-content\">" +
                "      <div class=\"edit-comment-hide\">" +
                "        <div class=\"comment-body markdown-body markdown-format\">" +
                "            <p>" + message + "</p>" +
                "        </div>" +
                "      </div>" +
                "    </div>" +
                "  </div>" +
                "</div>"

            // Add message element
            var messageList = $("#gitchat-message-list");
            messageList.append(messageHTML)

            // Scroll to bottom of message list
            messageList[0].scrollTop = messageList[0].scrollHeight;
        });
    });
}
