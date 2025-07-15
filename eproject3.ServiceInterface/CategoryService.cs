

using ServiceStack;
using ServiceStack.OrmLite;
using eproject3.ServiceModel.Types;
using eproject3.ServiceModel;

namespace eproject3.ServiceInterface
{
    public class CategoryService : Service
    {
        public object Post(CreateCategory request)
        {
            var category = new Category
            {
                Name = request.Name
            };

            Db.Save(category);
            return category;
        }

        public object Get(GetCategory request)
        {
            var category = Db.SingleById<Category>(request.Id);
            if (category == null)
                throw HttpError.NotFound($"Category with Id {request.Id} not found");

            return category;
        }

        public object Get(QueryCategories request)
        {
            return new QueryCategoriesResponse
            {
                Results = Db.Select<Category>()
            };
        }

        public object Put(UpdateCategory request)
        {
            var category = Db.SingleById<Category>(request.Id);
            if (category == null)
                throw HttpError.NotFound($"Category with Id {request.Id} not found");

            category.Name = request.Name;
            Db.Update(category);
            return category;
        }

        public void Delete(DeleteCategory request)
        {
            var category = Db.SingleById<Category>(request.Id);
            if (category == null)
                throw HttpError.NotFound($"Category with Id {request.Id} not found");

            Db.DeleteById<Category>(request.Id);
        }
    }
}
