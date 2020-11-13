from . import main
from flask import render_template, request, Response, json, jsonify
from flask_login import login_required, current_user, logout_user
from .. import csrf, db
from ..models import User, Word
from .utilities import validate_word, clean_input
import random, math

@main.route("/")
def index():
    if current_user.is_authenticated:
        logout_user()
    return render_template("index.html")

@main.route("/add", methods=["POST"])
@login_required
def add_word():
    data = request.get_json()
    words = clean_input(data["words"])
    
    if not current_user.is_authenticated or len(words) == 0:
        return Response(status=405)

    added_words = []

    for w in words:
        if validate_word(w) and not Word.query.filter_by(group=current_user.group.name).filter_by(word=w).first():
            added_words.append(w)

            word = Word(word=w, user_id=current_user.get_id(), group=current_user.group.name)
            db.session.add(word)
        db.session.commit()

    if len(added_words) == 0:
        return Response(status=405)


    return {"added_words": added_words,
            "count": len(added_words) }


@main.route("/words")
@login_required
def retrieve_words():
    length = len(Word.query.filter_by(group=current_user.group.name).all())
    words = [ Word.query.filter_by(group=current_user.group.name)
                  .offset( math.floor(random.random() * length)).first() for _ in range(27) ]

    print(words)
    data = []
    for w in words:
        if w:
            data.append( w.format() )
    
    return jsonify(data)

@main.route("/bank")
@login_required
def retrieve_words_clean():
    words = Word.query.filter_by(group=current_user.group.name).all()
    result = ""
    for w in words:
        result += f"{w.word}, "
    
    return result


@main.route("/count")
@login_required
def words_count():
    return str(len(Word.query.filter_by(group=current_user.group.name).all()))