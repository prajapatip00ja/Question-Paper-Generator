var wrapWithCode = function (selectedText) {
    return selectedText.trim() ? "<code>" + selectedText + "</code>" : selectedText;
};

exports.Presenter = function (view, questions_repo) {
    this.view = view;
    this.repo = questions_repo;
};

exports.Presenter.prototype = {
    onDocumentReady: function () {
        setAutosuggetions(this.repo, this.view)
    },
    markAsCode: function () {
        var selection = this.view.getSelection();
        var text = selection.all_content;
        var selectedText = text.substring(selection.start, selection.end);
        var preFix = text.substring(0, selection.start);
        var postFix = text.substring(selection.end);
        this.view.setQuestion(preFix + wrapWithCode(selectedText) + postFix)
    },
    onCreate: function () {
        var view = this.view;
        var question = this.view.getQuestion();
        var tags = this.view.getTags();

        if (tags.length && question.trim()) {

            var questionDetails = {
                question: question,
                answer: this.view.getAnswer(),
                tags: tags
            };

            var onComplete = function(err){
                view.clearScreen();
            };
            this.repo.create(questionDetails, onComplete);
            view.showSuccessMessage()
            view.addSuggetions(tags);
        }else{
            !question.trim() && view.showError("question")
            !tags.length && view.showError("tags")
        }

    }
};
var setAutosuggetions = function (repo, view) {
    repo.getUniqueTags(function (err,tags) {
        if(!err){
            view.setupTagBox(tags);
        }
    });
};