import os
from datetime import datetime
from urllib.parse import quote_plus
from flask_cors import CORS


from flask import Flask, jsonify, request
from werkzeug.exceptions import NotFound
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import exc as sa_exc
from dotenv import load_dotenv

# env varialbes come from the docker-compose file
load_dotenv()

db = SQLAlchemy()


def create_app():
    app = Flask(__name__)

    # config
    db_user = os.getenv("MYSQL_USER", "root")
    db_password = os.getenv("MYSQL_PASSWORD", "")
    db_password_quoted = quote_plus(db_password) if db_password else db_password
    db_host = os.getenv("MYSQL_HOST", "db")
    db_port = os.getenv("MYSQL_PORT", "3306")
    db_name = os.getenv("MYSQL_DATABASE", "seng513_db")

    app.config["SQLALCHEMY_DATABASE_URI"] = (
        f"mysql+pymysql://{db_user}:{db_password_quoted}@{db_host}:{db_port}/{db_name}"
    )


    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

    db.init_app(app)

    # data models
    class User(db.Model):
        __tablename__ = "users"

        id = db.Column(db.Integer, primary_key=True)
        username = db.Column(db.String(100), unique=True, nullable=False)
        email = db.Column(db.String(255), unique=True, nullable=False)
        role = db.Column(db.String(50), nullable=False, default="consumer")
        is_active = db.Column(db.Boolean, nullable=False, default=True)
        created_at = db.Column(db.DateTime, default=datetime.now)
        password_hash = db.Column(db.String(255), nullable=False, default="")
        
        

        def to_dict(self):
            return {
                "id": self.id,
                "username": self.username,
                "email": self.email,
                "role": self.role,
                "is_active": self.is_active,
                "created_at": self.created_at,
                "passwordhash": self.password_hash,
            }

    class Company(db.Model):
        __tablename__ = "companies"

        id = db.Column(db.Integer, primary_key=True)
        name = db.Column(db.String(255), unique=True, nullable=False)
        description = db.Column(db.Text)
        website = db.Column(db.String(255))
        created_at = db.Column(db.DateTime, default=datetime.utcnow)
        image_url = db.Column(db.String(255))

        products = db.relationship("Product", backref="company", lazy=True)

        def to_dict(self):
            return {
                "id": self.id,
                "name": self.name,
                "description": self.description,
                "website": self.website,
                "created_at": self.created_at.isoformat() if self.created_at else None,
                "image_url": self.image_url,
            }

    class Employee(db.Model):
        __tablename__ = "employees"
        id = db.Column(db.Integer, primary_key=True)
        user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
        company_id = db.Column(db.Integer, db.ForeignKey("companies.id"), nullable=False)
        employee_number = db.Column(db.String(50), nullable=True)
        title = db.Column(db.String(100), nullable=True)
        hired_at = db.Column(db.Date, nullable=True)

        def to_dict(self):
            return {
                "id": self.id,
                "user_id": self.user_id,
                "company_id": self.company_id,
                "employee_number": self.employee_number,
                "title": self.title,
                "hired_at": self.hired_at.isoformat() if self.hired_at else None,
            }

    class Product(db.Model):
        __tablename__ = "products"

        id = db.Column(db.Integer, primary_key=True)
        company_id = db.Column(db.Integer, db.ForeignKey("companies.id"), nullable=False)
        sku = db.Column(db.String(100))
        name = db.Column(db.String(255), nullable=False)
        description = db.Column(db.Text)
        price = db.Column(db.Numeric(10, 2))
        image_url = db.Column(db.String(255))
        created_at = db.Column(db.DateTime, default=datetime.utcnow)

        def to_dict(self):
            return {
                "id": self.id,
                "company_id": self.company_id,
                "sku": self.sku,
                "name": self.name,
                "description": self.description,
                "price": float(self.price) if self.price is not None else None,
                "created_at": self.created_at.isoformat() if self.created_at else None,
                "image_url": self.image_url,
            }

    class FeedbackType(db.Model):
        __tablename__ = "feedback_types"

        id = db.Column(db.Integer, primary_key=True)
        code = db.Column(db.String(50), unique=True, nullable=False)
        description = db.Column(db.String(255))

        def to_dict(self):
            return {
                "id": self.id,
                "code": self.code,
                "description": self.description,
            }
            
    class Announcement(db.Model):
        __tablename__ = "company_announcements"
        '''CREATE TABLE IF NOT EXISTS `company_announcements` (
        `id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
        `company_id` INT UNSIGNED NOT NULL,
        `title` VARCHAR(255) NOT NULL,
        `body` TEXT NOT NULL,
        `created_by_user_id` INT UNSIGNED DEFAULT NULL,
        `published_at` TIMESTAMP DEFAULT NULL,
        PRIMARY KEY (`id`),
        KEY `idx_ann_company` (`company_id`),
        CONSTRAINT `fk_announcement_company` FOREIGN KEY (`company_id`) REFERENCES `companies`(`id`) ON DELETE CASCADE,
        CONSTRAINT `fk_announcement_user` FOREIGN KEY (`created_by_user_id`) REFERENCES `users`(`id`) ON DELETE SET NULL
        );'''
        id = db.Column(db.Integer, primary_key=True)
        company_id = db.Column(db.Integer, db.ForeignKey("companies.id"), nullable=False)
        title = db.Column(db.String(255), nullable=False)
        body = db.Column(db.Text, nullable=False)
        created_by_user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
        published_at = db.Column(db.DateTime, nullable=True, default=datetime.utcnow)
        
        def to_dict(self):
            return {
                "id": self.id,
                "company_id": self.company_id,
                "title": self.title,
                "body": self.body,
                "created_by_user_id": self.created_by_user_id,
                "published_at": self.published_at.isoformat() if self.published_at else None,
            }
        

    class Feedback(db.Model):
        __tablename__ = "feedback"

        id = db.Column(db.Integer, primary_key=True)
        user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=True)
        company_id = db.Column(db.Integer, db.ForeignKey("companies.id"), nullable=True)
        product_id = db.Column(db.Integer, db.ForeignKey("products.id"), nullable=True)
        feedback_type_id = db.Column(
            db.Integer, db.ForeignKey("feedback_types.id"), nullable=False
        )
        parent_feedback_id = db.Column(
            db.Integer, db.ForeignKey("feedback.id"), nullable=True
        )
        title = db.Column(db.String(255))
        body = db.Column(db.Text, nullable=False)
        status = db.Column(db.String(50), default="open")
        created_at = db.Column(db.DateTime, default=datetime.utcnow)

        def to_dict(self):
            return {
                "id": self.id,
                "user_id": self.user_id,
                "company_id": self.company_id,
                "product_id": self.product_id,
                "feedback_type_id": self.feedback_type_id,
                "parent_feedback_id": self.parent_feedback_id,
                "title": self.title,
                "body": self.body,
                "status": self.status,
                "created_at": self.created_at.isoformat() if self.created_at else None,
            }

    # endpoints

    # 1) Healthcheck
    @app.route("/health", methods=["GET"])
    def health():
        return jsonify({"status": "ok"}), 200

    # 2) List users
    @app.route("/users", methods=["GET"])
    def list_users():
        users = User.query.all()
        return jsonify([u.to_dict() for u in users]), 200

    # 3) Get single user
    @app.route("/users/<int:user_id>", methods=["GET"])
    def get_user(user_id):
        user = User.query.get_or_404(user_id)
        return jsonify(user.to_dict()), 200


    # 3b) Get company id for a given user (via employees table)
    @app.route("/users/employee", methods=["GET"])
    def get_employee_from_user():
        user_id = request.args.get("user_id", type=int)
        if not user_id:
            return jsonify({"error": "user not found"}), 404
        try:
            employees = Employee.query.all()
            for e in employees:
                e_dict = e.to_dict()
                if int(e_dict.get("user_id")) == int(user_id):
                    return e.to_dict()
        except Exception as ex:
            # fallback for any other DB errors
            return jsonify({"company_id": None}), 200

        return jsonify({"company_id": None}), 200

    # 4) List companies
    @app.route("/companies", methods=["GET"])
    def list_companies():
        companies = Company.query.all()
        return jsonify([c.to_dict() for c in companies]), 200

    # 5) Create company
    @app.route("/companies", methods=["POST"])
    def create_company():
        data = request.get_json() or {}
        name = data.get("name")
        if not name:
            return jsonify({"error": "name is required"}), 400

        company = Company(
            name=name,
            description=data.get("description"),
            website=data.get("website"),
        )
        db.session.add(company)
        db.session.commit()
        return jsonify(company.to_dict()), 201

    # 6) List products for a company
    @app.route("/companies/products/<int:company_id>", methods=["GET"])
    def list_company_products(company_id):
        if not company_id:
            return jsonify({"error": "company not found"}), 404
        products = Product.query.filter_by(company_id=company_id).all()
        return jsonify([p.to_dict() for p in products]), 200

    # 7) Create feedback
    @app.route("/feedback", methods=["POST"])
    def create_feedback():
        data = request.get_json() or {}

        feedback_type_id = data.get("feedback_type_id")
        body = data.get("body")

        if not feedback_type_id or not body:
            return jsonify({"error": "feedback_type_id and body are required"}), 400

        feedback = Feedback(
            user_id=data.get("user_id"),
            company_id=data.get("company_id"),
            product_id=data.get("product_id"),
            feedback_type_id=feedback_type_id,
            parent_feedback_id=data.get("parent_feedback_id"),
            title=data.get("title"),
            body=body,
            status=data.get("status", "open"),
        )
        db.session.add(feedback)
        db.session.commit()
        return jsonify(feedback.to_dict()), 201

    # 8) List feedback (optionally filtered by company_id or product_id)
    @app.route("/feedback", methods=["GET"])
    def list_feedback():
        company_id = request.args.get("company_id", type=int)
        product_id = request.args.get("product_id", type=int)

        query = Feedback.query
        if company_id:
            query = query.filter_by(company_id=company_id)
        if product_id:
            query = query.filter_by(product_id=product_id)

        feedback_items = query.order_by(Feedback.created_at.desc()).all()
        return jsonify([f.to_dict() for f in feedback_items]), 200

    # 9) Get feedback types
    @app.route("/feedback-types", methods=["GET"])
    def list_feedback_types():
        types = FeedbackType.query.all()
        return jsonify([t.to_dict() for t in types]), 200

    # 10) Simple update feedback status
    @app.route("/feedback/<int:feedback_id>/status", methods=["PATCH"])
    def update_feedback_status(feedback_id):
        data = request.get_json() or {}
        status = data.get("status")
        if not status:
            return jsonify({"error": "status is required"}), 400

        feedback = Feedback.query.get_or_404(feedback_id)
        feedback.status = status
        db.session.commit()
        return jsonify(feedback.to_dict()), 200
    
    # 11) List products
    @app.route("/products", methods=["GET"])
    def list_products():
        products = Product.query.all()
        products_objects = [p.to_dict() for p in products]
        for p_obj in products_objects:
            company = Company.query.filter_by(id=p_obj["company_id"]).first()
            p_obj["company"] = company.name if company else ""
        return products_objects, 200
    
    # 12) Get single product
    @app.route("/products/<int:product_id>", methods=["GET"])
    def get_product(product_id):
        product = Product.query.get_or_404(product_id)
        company = Company.query.filter_by(id=product.company_id).first()
        company_name = company.name if company else ""
        return_dict = product.to_dict()
        return_dict["company"] = company_name
        return return_dict, 200
    
    # 13) get top 5 products by feedback count
    @app.route("/products/top-feedback", methods=["GET"])
    def top_feedback_products():
        products = list_products().get_json()
        feedback = list_feedback().get_json()
        feedback_count = {}
        for fb in feedback:
            pid = fb.get("product_id")
            if pid:
                feedback_count[pid] = feedback_count.get(pid, 0) + 1
        top_products = sorted(products, key=lambda p: feedback_count.get(p["id"], 0), reverse=True)[:5]
        return jsonify(top_products), 200
    
    # 14) get feedback for company id
    @app.route("/companies/<int:company_id>/feedback", methods=["GET"])
    def feedback_for_company(company_id):
        feedback_items = Feedback.query.filter_by(company_id=company_id).order_by(Feedback.created_at.desc()).all()
        return jsonify([f.to_dict() for f in feedback_items]), 200
    
    # 15) login
    @app.route("/login", methods=["POST"])
    def login():
        data = request.get_json() or {}
        email = data.get("email")
        passwordhash = data.get("password")
        if not email:
            return jsonify({"error": "username and email are required"}), 400
        user = User.query.filter_by(email=email).first()
        user_dict = user.to_dict() if user else None
        try:
            if user_dict:
                if user_dict.get("passwordhash") == passwordhash:
                    ret_user = {
                        "id": user_dict.get("id"),
                        "username": user_dict.get("username"),
                        "email": user_dict.get("email"),
                        "role": user_dict.get("role"),
                        "is_active": user_dict.get("is_active"),
                        "created_at": user_dict.get("created_at")
                    }
                    return jsonify({"message": "login successful", "user": ret_user}), 200
                else:
                    return jsonify({"error": f"invalid password"}), 401
            else:
                return jsonify({"error": "user not found."}), 404
        except Exception as e:
            return jsonify({"error": f"login error: {str(e)}"}), 500
        
    # 16) landing data
    @app.route("/landing-data", methods=["GET"])
    def landing_data():
        products = [p.to_dict() for p in Product.query.all()]
        feedback_items = [f.to_dict() for f in Feedback.query.all()]
        feedback_count: dict[int, int] = {}

        for fb in feedback_items:
            pid = fb.get("product_id")
            if pid:
                feedback_count[pid] = feedback_count.get(pid, 0) + 1

        top_products = sorted(
            products,
            key=lambda p: feedback_count.get(p["id"], 0),
            reverse=True,
        )[:5]

        landing_response = {
            "trendingProducts": top_products,
            "bottomCardImages": [
                {
                    "id": 1,
                    "image_url": "https://images.pexels.com/photos/90946/pexels-photo-90946.jpeg",
                },
                {
                    "id": 2,
                    "image_url": "https://images.pexels.com/photos/18105/pexels-photo.jpg",
                },
                {
                    "id": 3,
                    "image_url": "https://images.pexels.com/photos/276517/pexels-photo-276517.jpeg",
                },
            ],
        }

        return jsonify(landing_response), 200

    # 17) sign up
    @app.route("/signup", methods=["POST"])
    def signup():
        data = request.get_json() or {}
        username = data.get("username")
        email = data.get("email")
        passwordhash = data.get("password")
        if not username or not email or not passwordhash:
            return jsonify({"error": "username, email and password are required"}), 400
        existing_user = User.query.filter(
            (User.username == username) | (User.email == email)
        ).first()
        if existing_user:
            return jsonify({"error": "username or email already exists"}), 409
        new_user = User(
            username=username,
            email=email,
            password_hash=passwordhash,
            role="consumer",
            is_active=True,
            created_at=datetime.now()
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "signup successful", "user": new_user.to_dict()}), 201
    
    # 18) get single company
    @app.route("/company", methods=["GET"])
    def get_company():
        company_id = request.args.get("company_id", type=int)
        if not company_id:
            return jsonify({"error": "company not found"}), 404
        company = Company.query.get_or_404(company_id)
        return jsonify(company.to_dict()), 200
    
    # 19) get company announcements
    @app.route("/company/announcements/<int:company_id>", methods=["GET"])
    def get_company_announcements(company_id):
        if not company_id:
            return jsonify({"error": "company not found"}), 404

        announcements = Announcement.query.filter_by(company_id=company_id).all()
        company_announcements = [a.to_dict() for a in announcements]

        return jsonify(company_announcements), 200
    
    # 20) create company announcement
    @app.route("/announcement", methods=["POST"])
    def create_announcement():
        data = request.get_json() or {}
        try:
            title = data.get("title")
            body = data.get("body")
            created_by_user_id = data.get("publisher_id")
            company_id = data.get("company_id")
            
            announcement = Announcement(
                title=title,
                company_id=company_id,
                body=body,
                created_by_user_id=created_by_user_id
            )
            
            db.session.add(announcement)
            db.session.commit()
        except Exception:
            return jsonify("Announcement creation failed"), 500
        
        return jsonify("Announcement created"), 200
    
    # 21) create product
    @app.route("/product", methods=["POST"])
    def create_product():
        data = request.get_json() or {}
        try:
            sku = data.get("sku")
            name = data.get("name")
            description = data.get("description")
            price = data.get("price")
            image_url = data.get("image_url")
            company_id = data.get("company_id")
            
            product = Product(
                name=name,
                company_id=company_id,
                sku=sku,
                description=description,
                price=price,
                image_url=image_url
            )
            
            db.session.add(product)
            db.session.commit()
        except Exception:
            return jsonify("Product creation failed"), 500
        
        return jsonify("Product created"), 200

    
    # enable CORS for the created app so preflight (OPTIONS) requests
    # are handled regardless of how the app is run (dev/prod/Werkzeug/gunicorn)
    CORS(app, resources={r"/*": {"origins": "*"}})
    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5000, debug=True)
