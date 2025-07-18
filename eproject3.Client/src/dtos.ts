/* Options:
Date: 2025-07-18 17:04:55
Version: 8.80
Tip: To override a DTO option, remove "//" prefix before updating
BaseUrl: https://localhost:5001

//GlobalNamespace: 
//MakePropertiesOptional: False
//AddServiceStackTypes: True
//AddResponseStatus: False
//AddImplicitVersion: 
//AddDescriptionAsComments: True
//IncludeTypes: 
//ExcludeTypes: 
//DefaultImports: 
*/

// @ts-nocheck

export interface IReturn<T>
{
    createResponse(): T;
}

export interface IReturnVoid
{
    createResponse(): void;
}

export interface IPost
{
}

export interface IHasSessionId
{
    sessionId?: string;
}

export interface IHasBearerToken
{
    bearerToken?: string;
}

export interface IGet
{
}

export enum PaymentMethod
{
    QRCode = 'QRCode',
    CASH = 'CASH',
}

export class OrderItemRequest
{
    public productId: number;
    public quantity: number;

    public constructor(init?: Partial<OrderItemRequest>) { (Object as any).assign(this, init); }
}

export enum CreatorType
{
    Artist = 'Artist',
    Producer = 'Producer',
    Studio = 'Studio',
}

/** @description Sign Up */
// @Api(Description="Sign Up")
// @DataContract
export class Register implements IPost
{
    // @DataMember(Order=1)
    public userName: string;

    // @DataMember(Order=2)
    public firstName: string;

    // @DataMember(Order=3)
    public lastName: string;

    // @DataMember(Order=4)
    public displayName: string;

    // @DataMember(Order=5)
    public email: string;

    // @DataMember(Order=6)
    public password: string;

    // @DataMember(Order=7)
    public confirmPassword: string;

    // @DataMember(Order=8)
    public autoLogin?: boolean;

    // @DataMember(Order=10)
    public errorView: string;

    // @DataMember(Order=11)
    public meta: { [index:string]: string; };

    public constructor(init?: Partial<Register>) { (Object as any).assign(this, init); }
}

export enum OrderStatus
{
    Ongoing = 'Ongoing',
    Pending = 'Pending',
    Cancelled = 'Cancelled',
    Complete = 'Complete',
}

export class OrderItemDto
{
    public id: number;
    public productId: number;
    public productTitle: string;
    public unitPrice: number;
    public quantity: number;

    public constructor(init?: Partial<OrderItemDto>) { (Object as any).assign(this, init); }
}

export class OrderDto
{
    public orderId: number;
    public createdAt: string;
    public total: number;
    public paymentMethod: string;
    public status: string;
    public items: OrderItemDto[] = [];

    public constructor(init?: Partial<OrderDto>) { (Object as any).assign(this, init); }
}

export class CollectionItemDto
{
    public productId: number;
    public title: string;
    public image: string;
    public price: number;
    public addedAt: string;

    public constructor(init?: Partial<CollectionItemDto>) { (Object as any).assign(this, init); }
}

export class Highlight
{
    public id: number;
    public route: string;
    public imageUrl: string;
    public link: string;
    // @Required()
    public sortOrder: number;

    public constructor(init?: Partial<Highlight>) { (Object as any).assign(this, init); }
}

export class Promotion
{
    public id: number;
    // @References("typeof(eproject3.ServiceModel.Product)")
    public productId: number;

    // @Required()
    public promotionName: string;

    // @Required()
    public discountPercentage: number;

    // @Required()
    public startDate: string;

    // @Required()
    public endDate: string;

    public constructor(init?: Partial<Promotion>) { (Object as any).assign(this, init); }
}

export class Product
{
    public id: number;
    // @Required()
    public title: string;

    // @Required()
    public image: string;

    // @Required()
    public price: number;

    public description: string;
    public available: boolean;
    public stock: number;
    // @References("typeof(eproject3.ServiceModel.Category)")
    public categoryId: number;

    // @References("typeof(eproject3.ServiceModel.Creator)")
    public creatorId: number;

    public heroSection: boolean;
    public youtubeTrailerLink: string;
    public deliveryCharge: number;

    public constructor(init?: Partial<Product>) { (Object as any).assign(this, init); }
}

export class ProductView extends Product
{
    public promotionName: string;
    public averageRating?: number;

    public constructor(init?: Partial<ProductView>) { super(init); (Object as any).assign(this, init); }
}

// @DataContract
export class ResponseError
{
    // @DataMember(Order=1)
    public errorCode: string;

    // @DataMember(Order=2)
    public fieldName: string;

    // @DataMember(Order=3)
    public message: string;

    // @DataMember(Order=4)
    public meta: { [index:string]: string; };

    public constructor(init?: Partial<ResponseError>) { (Object as any).assign(this, init); }
}

// @DataContract
export class ResponseStatus
{
    // @DataMember(Order=1)
    public errorCode: string;

    // @DataMember(Order=2)
    public message: string;

    // @DataMember(Order=3)
    public stackTrace: string;

    // @DataMember(Order=4)
    public errors: ResponseError[];

    // @DataMember(Order=5)
    public meta: { [index:string]: string; };

    public constructor(init?: Partial<ResponseStatus>) { (Object as any).assign(this, init); }
}

// @DataContract
export class AnalyticsLogInfo
{
    // @DataMember(Order=1)
    public id: number;

    // @DataMember(Order=2)
    public dateTime: string;

    // @DataMember(Order=3)
    public browser: string;

    // @DataMember(Order=4)
    public device: string;

    // @DataMember(Order=5)
    public bot: string;

    // @DataMember(Order=6)
    public op: string;

    // @DataMember(Order=7)
    public userId: string;

    // @DataMember(Order=8)
    public userName: string;

    // @DataMember(Order=9)
    public apiKey: string;

    // @DataMember(Order=10)
    public ip: string;

    public constructor(init?: Partial<AnalyticsLogInfo>) { (Object as any).assign(this, init); }
}

// @DataContract
export class RequestSummary
{
    // @DataMember(Order=1)
    public name: string;

    // @DataMember(Order=2)
    public totalRequests: number;

    // @DataMember(Order=3)
    public totalRequestLength: number;

    // @DataMember(Order=4)
    public minRequestLength: number;

    // @DataMember(Order=5)
    public maxRequestLength: number;

    // @DataMember(Order=6)
    public totalDuration: number;

    // @DataMember(Order=7)
    public minDuration: number;

    // @DataMember(Order=8)
    public maxDuration: number;

    // @DataMember(Order=9)
    public status: { [index:number]: number; };

    // @DataMember(Order=10)
    public durations: { [index:string]: number; };

    // @DataMember(Order=11)
    public apis: { [index:string]: number; };

    // @DataMember(Order=12)
    public users: { [index:string]: number; };

    // @DataMember(Order=13)
    public ips: { [index:string]: number; };

    // @DataMember(Order=14)
    public apiKeys: { [index:string]: number; };

    public constructor(init?: Partial<RequestSummary>) { (Object as any).assign(this, init); }
}

// @DataContract
export class AnalyticsReports
{
    // @DataMember(Order=1)
    public id: number;

    // @DataMember(Order=2)
    public created: string;

    // @DataMember(Order=3)
    public version: number;

    // @DataMember(Order=4)
    public apis: { [index:string]: RequestSummary; };

    // @DataMember(Order=5)
    public users: { [index:string]: RequestSummary; };

    // @DataMember(Order=6)
    public tags: { [index:string]: RequestSummary; };

    // @DataMember(Order=7)
    public status: { [index:string]: RequestSummary; };

    // @DataMember(Order=8)
    public days: { [index:string]: RequestSummary; };

    // @DataMember(Order=9)
    public apiKeys: { [index:string]: RequestSummary; };

    // @DataMember(Order=10)
    public ips: { [index:string]: RequestSummary; };

    // @DataMember(Order=11)
    public browsers: { [index:string]: RequestSummary; };

    // @DataMember(Order=12)
    public devices: { [index:string]: RequestSummary; };

    // @DataMember(Order=13)
    public bots: { [index:string]: RequestSummary; };

    // @DataMember(Order=14)
    public durations: { [index:string]: number; };

    public constructor(init?: Partial<AnalyticsReports>) { (Object as any).assign(this, init); }
}

export class CartItemDto
{
    public id: number;
    public productId: number;
    public productTitle: string;
    public productImage: string;
    public productPrice: number;
    public quantity: number;
    public addedAt: string;
    public deliveryCharge: number;

    public constructor(init?: Partial<CartItemDto>) { (Object as any).assign(this, init); }
}

export class GetCartResponse
{
    public items: CartItemDto[] = [];
    public total: number;

    public constructor(init?: Partial<GetCartResponse>) { (Object as any).assign(this, init); }
}

export class OrderResponse
{
    public orderId: number;
    public status: OrderStatus;
    public total: number;
    public createdAt: string;

    public constructor(init?: Partial<OrderResponse>) { (Object as any).assign(this, init); }
}

export class GetOrdersResponse
{
    public orders: OrderDto[] = [];

    public constructor(init?: Partial<GetOrdersResponse>) { (Object as any).assign(this, init); }
}

export class Category
{
    public id: number;
    // @Required()
    public name: string;

    public constructor(init?: Partial<Category>) { (Object as any).assign(this, init); }
}

export class QueryCategoriesResponse
{
    public results: Category[] = [];

    public constructor(init?: Partial<QueryCategoriesResponse>) { (Object as any).assign(this, init); }
}

export class Channel
{
    public id: number;
    // @Required()
    // @StringLength(100)
    public name: string;

    public description: string;
    // @Required()
    public createdAt: string;

    public constructor(init?: Partial<Channel>) { (Object as any).assign(this, init); }
}

export class GetChannelsResponse
{
    public channels: Channel[] = [];

    public constructor(init?: Partial<GetChannelsResponse>) { (Object as any).assign(this, init); }
}

export class CollectionDto
{
    public id: number;
    public name: string;

    public constructor(init?: Partial<CollectionDto>) { (Object as any).assign(this, init); }
}

export class GetCollectionsResponse
{
    public collections: CollectionDto[] = [];

    public constructor(init?: Partial<GetCollectionsResponse>) { (Object as any).assign(this, init); }
}

export class GetCollectionItemsResponse
{
    public items: CollectionItemDto[] = [];

    public constructor(init?: Partial<GetCollectionItemsResponse>) { (Object as any).assign(this, init); }
}

export class Comment
{
    public id: number;
    public postId: number;
    public parentCommentId?: number;
    public userId: number;
    public content: string;
    public createdAt: string;
    // @Ignore()
    public review: number;

    // @Ignore()
    public replies: Comment[] = [];

    public constructor(init?: Partial<Comment>) { (Object as any).assign(this, init); }
}

export class GetCommentsResponse
{
    public comments: Comment[] = [];

    public constructor(init?: Partial<GetCommentsResponse>) { (Object as any).assign(this, init); }
}

export class Creator
{
    public id: number;
    // @Required()
    public name: string;

    // @Required()
    public type: CreatorType;

    public isHero: boolean;
    public image: string;
    public description: string;

    public constructor(init?: Partial<Creator>) { (Object as any).assign(this, init); }
}

export class QueryCreatorsResponse
{
    public results: Creator[] = [];

    public constructor(init?: Partial<QueryCreatorsResponse>) { (Object as any).assign(this, init); }
}

export class Genre
{
    public id: number;
    // @Required()
    public name: string;

    // @References("typeof(eproject3.ServiceModel.Category)")
    public categoryId: number;

    public constructor(init?: Partial<Genre>) { (Object as any).assign(this, init); }
}

export class QueryGenresResponse
{
    public results: Genre[] = [];

    public constructor(init?: Partial<QueryGenresResponse>) { (Object as any).assign(this, init); }
}

export class QueryHighlightsResponse
{
    public results: Highlight[] = [];

    public constructor(init?: Partial<QueryHighlightsResponse>) { (Object as any).assign(this, init); }
}

export class HelloResponse
{
    public result: string;

    public constructor(init?: Partial<HelloResponse>) { (Object as any).assign(this, init); }
}

export class Post
{
    public id: number;
    // @References("typeof(eproject3.ServiceModel.Channel)")
    public channelId: number;

    // @References("typeof(eproject3.ServiceModel.CustomUser)")
    public userId: number;

    // @Required()
    // @StringLength(200)
    public title: string;

    public content: string;
    // @Required()
    public createdAt: string;

    // @Ignore()
    public review: number;

    public constructor(init?: Partial<Post>) { (Object as any).assign(this, init); }
}

export class GetPostsResponse
{
    public posts: Post[] = [];

    public constructor(init?: Partial<GetPostsResponse>) { (Object as any).assign(this, init); }
}

export class ProductResponse
{
    public product: Product;
    public genres: Genre[] = [];
    public activePromotion: Promotion;
    public averageRating: number;
    public reviewCount: number;

    public constructor(init?: Partial<ProductResponse>) { (Object as any).assign(this, init); }
}

export class QueryProductsResponse
{
    public results: ProductView[] = [];
    public total: number;

    public constructor(init?: Partial<QueryProductsResponse>) { (Object as any).assign(this, init); }
}

export class UserProfileResponse
{
    public displayName: string;
    public email: string;
    public phoneNumber: string;
    public address: string;
    public gender: string;
    public birthDate?: string;
    public profileImageUrl: string;
    public responseStatus: ResponseStatus;

    public constructor(init?: Partial<UserProfileResponse>) { (Object as any).assign(this, init); }
}

// @DataContract
export class EmptyResponse
{
    // @DataMember(Order=1)
    public responseStatus: ResponseStatus;

    public constructor(init?: Partial<EmptyResponse>) { (Object as any).assign(this, init); }
}

// @DataContract
export class RegisterResponse implements IHasSessionId, IHasBearerToken
{
    // @DataMember(Order=1)
    public userId: string;

    // @DataMember(Order=2)
    public sessionId: string;

    // @DataMember(Order=3)
    public userName: string;

    // @DataMember(Order=4)
    public referrerUrl: string;

    // @DataMember(Order=5)
    public bearerToken: string;

    // @DataMember(Order=6)
    public refreshToken: string;

    // @DataMember(Order=7)
    public refreshTokenExpiry?: string;

    // @DataMember(Order=8)
    public roles: string[];

    // @DataMember(Order=9)
    public permissions: string[];

    // @DataMember(Order=10)
    public redirectUrl: string;

    // @DataMember(Order=11)
    public responseStatus: ResponseStatus;

    // @DataMember(Order=12)
    public meta: { [index:string]: string; };

    public constructor(init?: Partial<RegisterResponse>) { (Object as any).assign(this, init); }
}

export class ReviewDto
{
    public id: number;
    public productId: number;
    public userId: number;
    public userEmail: string;
    public rating: number;
    public reviewText: string;
    public createdAt: string;

    public constructor(init?: Partial<ReviewDto>) { (Object as any).assign(this, init); }
}

export class GetReviewsResponse
{
    public reviews: ReviewDto[] = [];
    public total: number;

    public constructor(init?: Partial<GetReviewsResponse>) { (Object as any).assign(this, init); }
}

// @DataContract
export class AuthenticateResponse implements IHasSessionId, IHasBearerToken
{
    // @DataMember(Order=1)
    public userId: string;

    // @DataMember(Order=2)
    public sessionId: string;

    // @DataMember(Order=3)
    public userName: string;

    // @DataMember(Order=4)
    public displayName: string;

    // @DataMember(Order=5)
    public referrerUrl: string;

    // @DataMember(Order=6)
    public bearerToken: string;

    // @DataMember(Order=7)
    public refreshToken: string;

    // @DataMember(Order=8)
    public refreshTokenExpiry?: string;

    // @DataMember(Order=9)
    public profileUrl: string;

    // @DataMember(Order=10)
    public roles: string[];

    // @DataMember(Order=11)
    public permissions: string[];

    // @DataMember(Order=12)
    public authProvider: string;

    // @DataMember(Order=13)
    public responseStatus: ResponseStatus;

    // @DataMember(Order=14)
    public meta: { [index:string]: string; };

    public constructor(init?: Partial<AuthenticateResponse>) { (Object as any).assign(this, init); }
}

// @DataContract
export class AssignRolesResponse
{
    // @DataMember(Order=1)
    public allRoles: string[];

    // @DataMember(Order=2)
    public allPermissions: string[];

    // @DataMember(Order=3)
    public meta: { [index:string]: string; };

    // @DataMember(Order=4)
    public responseStatus: ResponseStatus;

    public constructor(init?: Partial<AssignRolesResponse>) { (Object as any).assign(this, init); }
}

// @DataContract
export class UnAssignRolesResponse
{
    // @DataMember(Order=1)
    public allRoles: string[];

    // @DataMember(Order=2)
    public allPermissions: string[];

    // @DataMember(Order=3)
    public meta: { [index:string]: string; };

    // @DataMember(Order=4)
    public responseStatus: ResponseStatus;

    public constructor(init?: Partial<UnAssignRolesResponse>) { (Object as any).assign(this, init); }
}

// @DataContract
export class GetAnalyticsInfoResponse
{
    // @DataMember(Order=1)
    public months: string[];

    // @DataMember(Order=2)
    public result: AnalyticsLogInfo;

    // @DataMember(Order=3)
    public responseStatus: ResponseStatus;

    public constructor(init?: Partial<GetAnalyticsInfoResponse>) { (Object as any).assign(this, init); }
}

// @DataContract
export class GetAnalyticsReportsResponse
{
    // @DataMember(Order=1)
    public result: AnalyticsReports;

    // @DataMember(Order=2)
    public responseStatus: ResponseStatus;

    public constructor(init?: Partial<GetAnalyticsReportsResponse>) { (Object as any).assign(this, init); }
}

// @DataContract
export class GetAccessTokenResponse
{
    // @DataMember(Order=1)
    public accessToken: string;

    // @DataMember(Order=2)
    public meta: { [index:string]: string; };

    // @DataMember(Order=3)
    public responseStatus: ResponseStatus;

    public constructor(init?: Partial<GetAccessTokenResponse>) { (Object as any).assign(this, init); }
}

// @Route("/api/cart", "POST")
export class AddToCart implements IReturn<CartItemDto>
{
    public productId: number;
    public quantity: number;

    public constructor(init?: Partial<AddToCart>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'AddToCart'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new CartItemDto(); }
}

// @Route("/api/cart", "GET")
export class GetCart implements IReturn<GetCartResponse>
{

    public constructor(init?: Partial<GetCart>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'GetCart'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new GetCartResponse(); }
}

// @Route("/api/cart/{Id}", "DELETE")
export class RemoveCartItem implements IReturnVoid
{
    public id: number;

    public constructor(init?: Partial<RemoveCartItem>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'RemoveCartItem'; }
    public getMethod() { return 'DELETE'; }
    public createResponse() {}
}

// @Route("/api/cart/clear", "POST")
export class ClearCart implements IReturnVoid
{

    public constructor(init?: Partial<ClearCart>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'ClearCart'; }
    public getMethod() { return 'POST'; }
    public createResponse() {}
}

// @Route("/api/orders", "POST")
export class CreateOrder implements IReturn<OrderResponse>
{
    public shippingAddress: string;
    public paymentMethod: PaymentMethod;
    public items: OrderItemRequest[] = [];

    public constructor(init?: Partial<CreateOrder>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'CreateOrder'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new OrderResponse(); }
}

// @Route("/api/orders", "GET")
export class GetOrders implements IReturn<GetOrdersResponse>
{

    public constructor(init?: Partial<GetOrders>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'GetOrders'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new GetOrdersResponse(); }
}

// @Route("/api/orders/cancel", "POST")
export class CancelOrder implements IReturnVoid
{
    public orderId: number;

    public constructor(init?: Partial<CancelOrder>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'CancelOrder'; }
    public getMethod() { return 'POST'; }
    public createResponse() {}
}

// @Route("/api/categories", "POST")
export class CreateCategory implements IReturn<Category>
{
    public name: string;

    public constructor(init?: Partial<CreateCategory>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'CreateCategory'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new Category(); }
}

// @Route("/api/categories/{Id}", "GET")
export class GetCategory implements IReturn<Category>
{
    public id: number;

    public constructor(init?: Partial<GetCategory>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'GetCategory'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new Category(); }
}

// @Route("/api/categories", "GET")
export class QueryCategories implements IReturn<QueryCategoriesResponse>
{

    public constructor(init?: Partial<QueryCategories>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'QueryCategories'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new QueryCategoriesResponse(); }
}

// @Route("/api/categories/{Id}", "PUT")
export class UpdateCategory implements IReturn<Category>
{
    public id: number;
    public name: string;

    public constructor(init?: Partial<UpdateCategory>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'UpdateCategory'; }
    public getMethod() { return 'PUT'; }
    public createResponse() { return new Category(); }
}

// @Route("/api/categories/{Id}", "DELETE")
export class DeleteCategory implements IReturnVoid
{
    public id: number;

    public constructor(init?: Partial<DeleteCategory>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'DeleteCategory'; }
    public getMethod() { return 'DELETE'; }
    public createResponse() {}
}

// @Route("/api/channels", "GET")
export class GetChannels implements IReturn<GetChannelsResponse>
{

    public constructor(init?: Partial<GetChannels>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'GetChannels'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new GetChannelsResponse(); }
}

// @Route("/api/channels/{Id}", "GET")
export class GetChannel implements IReturn<Channel>
{
    public id: number;

    public constructor(init?: Partial<GetChannel>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'GetChannel'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new Channel(); }
}

// @Route("/api/channels", "POST")
export class CreateChannel implements IReturn<Channel>
{
    public name: string;
    public description: string;

    public constructor(init?: Partial<CreateChannel>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'CreateChannel'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new Channel(); }
}

// @Route("/api/channels/{Id}", "PUT")
export class UpdateChannel implements IReturn<Channel>
{
    public id: number;
    public name: string;
    public description: string;

    public constructor(init?: Partial<UpdateChannel>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'UpdateChannel'; }
    public getMethod() { return 'PUT'; }
    public createResponse() { return new Channel(); }
}

// @Route("/api/channels/{Id}", "DELETE")
export class DeleteChannel implements IReturnVoid
{
    public id: number;

    public constructor(init?: Partial<DeleteChannel>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'DeleteChannel'; }
    public getMethod() { return 'DELETE'; }
    public createResponse() {}
}

// @Route("/api/collections", "POST")
export class CreateCollection implements IReturn<CollectionDto>
{
    public name: string;

    public constructor(init?: Partial<CreateCollection>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'CreateCollection'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new CollectionDto(); }
}

// @Route("/api/collections", "GET")
export class GetCollections implements IReturn<GetCollectionsResponse>
{
    public searchTerm?: string;
    public prefix?: string;

    public constructor(init?: Partial<GetCollections>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'GetCollections'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new GetCollectionsResponse(); }
}

// @Route("/api/collections/{Id}", "PUT")
export class UpdateCollection implements IReturn<CollectionDto>
{
    public id: number;
    public name: string;

    public constructor(init?: Partial<UpdateCollection>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'UpdateCollection'; }
    public getMethod() { return 'PUT'; }
    public createResponse() { return new CollectionDto(); }
}

// @Route("/api/collections/{Id}", "DELETE")
export class DeleteCollection implements IReturnVoid
{
    public id: number;

    public constructor(init?: Partial<DeleteCollection>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'DeleteCollection'; }
    public getMethod() { return 'DELETE'; }
    public createResponse() {}
}

// @Route("/api/collections/{Name}/items", "POST")
export class AddToCollection implements IReturnVoid
{
    public name: string;
    public productId: number;

    public constructor(init?: Partial<AddToCollection>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'AddToCollection'; }
    public getMethod() { return 'POST'; }
    public createResponse() {}
}

// @Route("/api/collections/{Name}/items/{ProductId}", "DELETE")
export class RemoveFromCollection implements IReturnVoid
{
    public name: string;
    public productId: number;

    public constructor(init?: Partial<RemoveFromCollection>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'RemoveFromCollection'; }
    public getMethod() { return 'DELETE'; }
    public createResponse() {}
}

// @Route("/api/collections/{Name}/items", "GET")
export class GetCollectionItems implements IReturn<GetCollectionItemsResponse>
{
    public name: string;

    public constructor(init?: Partial<GetCollectionItems>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'GetCollectionItems'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new GetCollectionItemsResponse(); }
}

// @Route("/api/comments", "GET")
export class GetComments implements IReturn<GetCommentsResponse>
{
    public postId: number;

    public constructor(init?: Partial<GetComments>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'GetComments'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new GetCommentsResponse(); }
}

// @Route("/api/comments/{Id}", "GET")
export class GetComment implements IReturn<Comment>
{
    public id: number;

    public constructor(init?: Partial<GetComment>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'GetComment'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new Comment(); }
}

// @Route("/api/comments", "POST")
export class CreateComment implements IReturn<Comment>
{
    public postId: number;
    public parentCommentId?: number;
    public content: string;

    public constructor(init?: Partial<CreateComment>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'CreateComment'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new Comment(); }
}

// @Route("/api/comments/{Id}", "PUT")
export class UpdateComment implements IReturn<Comment>
{
    public id: number;
    public content: string;

    public constructor(init?: Partial<UpdateComment>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'UpdateComment'; }
    public getMethod() { return 'PUT'; }
    public createResponse() { return new Comment(); }
}

// @Route("/api/comments/{Id}", "DELETE")
export class DeleteComment implements IReturnVoid
{
    public id: number;

    public constructor(init?: Partial<DeleteComment>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'DeleteComment'; }
    public getMethod() { return 'DELETE'; }
    public createResponse() {}
}

// @Route("/api/creators", "GET")
export class QueryCreators implements IReturn<QueryCreatorsResponse>
{
    public type?: CreatorType;
    public isHero?: boolean;

    public constructor(init?: Partial<QueryCreators>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'QueryCreators'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new QueryCreatorsResponse(); }
}

// @Route("/api/creators/{Id}", "GET")
export class GetCreator implements IReturn<Creator>
{
    public id: number;

    public constructor(init?: Partial<GetCreator>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'GetCreator'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new Creator(); }
}

// @Route("/api/creators", "POST")
export class CreateCreator implements IReturn<Creator>
{
    public name: string;
    public type: CreatorType;
    public isHero: boolean;
    public image: string;
    public description: string;

    public constructor(init?: Partial<CreateCreator>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'CreateCreator'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new Creator(); }
}

// @Route("/api/creators/{Id}", "PUT")
export class UpdateCreator implements IReturn<Creator>
{
    public id: number;
    public name: string;
    public type: CreatorType;
    public isHero: boolean;
    public image: string;
    public description: string;

    public constructor(init?: Partial<UpdateCreator>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'UpdateCreator'; }
    public getMethod() { return 'PUT'; }
    public createResponse() { return new Creator(); }
}

// @Route("/api/creators/{Id}", "DELETE")
export class DeleteCreator implements IReturnVoid
{
    public id: number;

    public constructor(init?: Partial<DeleteCreator>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'DeleteCreator'; }
    public getMethod() { return 'DELETE'; }
    public createResponse() {}
}

// @Route("/api/genres", "POST")
export class CreateGenre implements IReturn<Genre>
{
    public name: string;
    public categoryId: number;

    public constructor(init?: Partial<CreateGenre>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'CreateGenre'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new Genre(); }
}

// @Route("/api/genres/{Id}", "GET")
export class GetGenre implements IReturn<Genre>
{
    public id: number;

    public constructor(init?: Partial<GetGenre>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'GetGenre'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new Genre(); }
}

// @Route("/api/genres", "GET")
export class QueryGenres implements IReturn<QueryGenresResponse>
{
    public categoryId?: number;

    public constructor(init?: Partial<QueryGenres>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'QueryGenres'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new QueryGenresResponse(); }
}

// @Route("/api/genres/{Id}", "PUT")
export class UpdateGenre implements IReturn<Genre>
{
    public id: number;
    public name: string;
    public categoryId: number;

    public constructor(init?: Partial<UpdateGenre>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'UpdateGenre'; }
    public getMethod() { return 'PUT'; }
    public createResponse() { return new Genre(); }
}

// @Route("/api/genres/{Id}", "DELETE")
export class DeleteGenre implements IReturnVoid
{
    public id: number;

    public constructor(init?: Partial<DeleteGenre>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'DeleteGenre'; }
    public getMethod() { return 'DELETE'; }
    public createResponse() {}
}

// @Route("/api/highlights", "GET")
export class QueryHighlights implements IReturn<QueryHighlightsResponse>
{
    public route: string;

    public constructor(init?: Partial<QueryHighlights>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'QueryHighlights'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new QueryHighlightsResponse(); }
}

// @Route("/hello/{Name}")
export class Hello implements IReturn<HelloResponse>, IGet
{
    public name: string;

    public constructor(init?: Partial<Hello>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'Hello'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new HelloResponse(); }
}

// @Route("/api/posts", "GET")
export class GetPosts implements IReturn<GetPostsResponse>
{
    public channelId?: number;

    public constructor(init?: Partial<GetPosts>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'GetPosts'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new GetPostsResponse(); }
}

// @Route("/api/posts/{Id}", "GET")
export class GetPost implements IReturn<Post>
{
    public id: number;

    public constructor(init?: Partial<GetPost>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'GetPost'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new Post(); }
}

// @Route("/api/posts", "POST")
export class CreatePost implements IReturn<Post>
{
    public channelId: number;
    public title: string;
    public content: string;

    public constructor(init?: Partial<CreatePost>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'CreatePost'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new Post(); }
}

// @Route("/api/posts/{Id}", "PUT")
export class UpdatePost implements IReturn<Post>
{
    public id: number;
    public title: string;
    public content: string;

    public constructor(init?: Partial<UpdatePost>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'UpdatePost'; }
    public getMethod() { return 'PUT'; }
    public createResponse() { return new Post(); }
}

// @Route("/api/posts/{Id}", "DELETE")
export class DeletePost implements IReturnVoid
{
    public id: number;

    public constructor(init?: Partial<DeletePost>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'DeletePost'; }
    public getMethod() { return 'DELETE'; }
    public createResponse() {}
}

// @Route("/api/products", "POST")
export class CreateProduct implements IReturn<Product>
{
    public title: string;
    public image: string;
    public price: number;
    public description: string;
    public available: boolean;
    public stock: number;
    public categoryId: number;
    public creatorId: number;
    public heroSection: boolean;
    public youtubeTrailerLink: string;
    public genreIds: number[] = [];

    public constructor(init?: Partial<CreateProduct>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'CreateProduct'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new Product(); }
}

// @Route("/api/products/{Id}", "GET")
export class GetProduct implements IReturn<ProductResponse>
{
    public id: number;

    public constructor(init?: Partial<GetProduct>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'GetProduct'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new ProductResponse(); }
}

// @Route("/api/products", "GET,POST")
export class QueryProducts implements IReturn<QueryProductsResponse>
{
    public categoryId?: number;
    public creatorId?: number;
    public available?: boolean;
    public priceMin?: number;
    public priceMax?: number;
    public titleContains?: string;
    public ratingMin?: number;
    public heroSection?: boolean;
    public skip?: number;
    public take?: number;
    public orderBy: string;
    public orderByDesc: string;
    public include: string;
    public fields: string;
    public genreIds?: number[];
    public meta?: { [index:string]: string; };

    public constructor(init?: Partial<QueryProducts>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'QueryProducts'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new QueryProductsResponse(); }
}

// @Route("/api/products/{Id}", "PUT")
export class UpdateProduct implements IReturn<Product>
{
    public id: number;
    public title: string;
    public image: string;
    public price: number;
    public description: string;
    public available: boolean;
    public stock: number;
    public categoryId: number;
    public creatorId: number;
    public heroSection: boolean;
    public youtubeTrailerLink: string;
    public genreIds: number[] = [];

    public constructor(init?: Partial<UpdateProduct>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'UpdateProduct'; }
    public getMethod() { return 'PUT'; }
    public createResponse() { return new Product(); }
}

// @Route("/api/products/{Id}", "DELETE")
export class DeleteProduct implements IReturnVoid
{
    public id: number;

    public constructor(init?: Partial<DeleteProduct>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'DeleteProduct'; }
    public getMethod() { return 'DELETE'; }
    public createResponse() {}
}

// @Route("/api/profile", "GET")
export class GetProfile implements IReturn<UserProfileResponse>
{

    public constructor(init?: Partial<GetProfile>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'GetProfile'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new UserProfileResponse(); }
}

// @Route("/api/profile", "PUT")
export class UpdateProfile implements IReturn<UserProfileResponse>
{
    public displayName: string;
    public address: string;
    public gender: string;
    public birthDate?: string;
    public email: string;
    public phoneNumber: string;

    public constructor(init?: Partial<UpdateProfile>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'UpdateProfile'; }
    public getMethod() { return 'PUT'; }
    public createResponse() { return new UserProfileResponse(); }
}

// @Route("/api/profile/image", "POST")
export class UploadProfileImage implements IReturn<UserProfileResponse>
{
    public dummy: boolean;

    public constructor(init?: Partial<UploadProfileImage>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'UploadProfileImage'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new UserProfileResponse(); }
}

// @Route("/api/profile/change-password", "POST")
export class ChangePassword implements IReturn<EmptyResponse>
{
    public oldPassword: string;
    public newPassword: string;

    public constructor(init?: Partial<ChangePassword>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'ChangePassword'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new EmptyResponse(); }
}

/** @description Sign Up */
// @Route("/register", "POST")
// @Api(Description="Sign Up")
export class RegisterExtended extends Register implements IReturn<RegisterResponse>
{
    public birthDate?: string;
    public address?: string;
    public gender?: string;
    public phoneNumber?: string;
    public city?: string;
    public country?: string;
    public firstName?: string;
    public lastName?: string;

    public constructor(init?: Partial<RegisterExtended>) { super(init); (Object as any).assign(this, init); }
    public getTypeName() { return 'RegisterExtended'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new RegisterResponse(); }
}

// @Route("/api/reviews", "POST")
export class CreateReview implements IReturn<ReviewDto>
{
    public productId: number;
    public rating: number;
    public reviewText: string;

    public constructor(init?: Partial<CreateReview>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'CreateReview'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new ReviewDto(); }
}

// @Route("/api/reviews/{Id}", "PUT")
export class UpdateReview implements IReturn<ReviewDto>
{
    public id: number;
    public rating: number;
    public reviewText: string;

    public constructor(init?: Partial<UpdateReview>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'UpdateReview'; }
    public getMethod() { return 'PUT'; }
    public createResponse() { return new ReviewDto(); }
}

// @Route("/api/reviews/{Id}", "DELETE")
export class DeleteReview implements IReturnVoid
{
    public id: number;

    public constructor(init?: Partial<DeleteReview>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'DeleteReview'; }
    public getMethod() { return 'DELETE'; }
    public createResponse() {}
}

// @Route("/api/reviews", "GET")
// @Route("/api/reviews/{ProductId}", "GET")
export class GetReviews implements IReturn<GetReviewsResponse>
{
    public productId?: number;
    public rating?: number;
    public page: number;
    public pageSize: number;

    public constructor(init?: Partial<GetReviews>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'GetReviews'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new GetReviewsResponse(); }
}

// @Route("/api/posts/{PostId}/vote", "POST")
export class VotePost implements IReturnVoid
{
    public postId: number;
    public voteType: SByte;

    public constructor(init?: Partial<VotePost>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'VotePost'; }
    public getMethod() { return 'POST'; }
    public createResponse() {}
}

// @Route("/api/posts/{PostId}/vote", "DELETE")
export class UnvotePost implements IReturnVoid
{
    public postId: number;

    public constructor(init?: Partial<UnvotePost>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'UnvotePost'; }
    public getMethod() { return 'DELETE'; }
    public createResponse() {}
}

// @Route("/api/comments/{CommentId}/vote", "POST")
export class VoteComment implements IReturnVoid
{
    public commentId: number;
    public voteType: SByte;

    public constructor(init?: Partial<VoteComment>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'VoteComment'; }
    public getMethod() { return 'POST'; }
    public createResponse() {}
}

// @Route("/api/comments/{CommentId}/vote", "DELETE")
export class UnvoteComment implements IReturnVoid
{
    public commentId: number;

    public constructor(init?: Partial<UnvoteComment>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'UnvoteComment'; }
    public getMethod() { return 'DELETE'; }
    public createResponse() {}
}

/** @description Sign In */
// @Route("/auth", "GET,POST")
// @Route("/auth/{provider}", "GET,POST")
// @Api(Description="Sign In")
// @DataContract
export class Authenticate implements IReturn<AuthenticateResponse>, IPost
{
    /** @description AuthProvider, e.g. credentials */
    // @DataMember(Order=1)
    public provider: string;

    // @DataMember(Order=2)
    public userName: string;

    // @DataMember(Order=3)
    public password: string;

    // @DataMember(Order=4)
    public rememberMe?: boolean;

    // @DataMember(Order=5)
    public accessToken: string;

    // @DataMember(Order=6)
    public accessTokenSecret: string;

    // @DataMember(Order=7)
    public returnUrl: string;

    // @DataMember(Order=8)
    public errorView: string;

    // @DataMember(Order=9)
    public meta: { [index:string]: string; };

    public constructor(init?: Partial<Authenticate>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'Authenticate'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new AuthenticateResponse(); }
}

// @Route("/assignroles", "POST")
// @DataContract
export class AssignRoles implements IReturn<AssignRolesResponse>, IPost
{
    // @DataMember(Order=1)
    public userName: string;

    // @DataMember(Order=2)
    public permissions: string[];

    // @DataMember(Order=3)
    public roles: string[];

    // @DataMember(Order=4)
    public meta: { [index:string]: string; };

    public constructor(init?: Partial<AssignRoles>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'AssignRoles'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new AssignRolesResponse(); }
}

// @Route("/unassignroles", "POST")
// @DataContract
export class UnAssignRoles implements IReturn<UnAssignRolesResponse>, IPost
{
    // @DataMember(Order=1)
    public userName: string;

    // @DataMember(Order=2)
    public permissions: string[];

    // @DataMember(Order=3)
    public roles: string[];

    // @DataMember(Order=4)
    public meta: { [index:string]: string; };

    public constructor(init?: Partial<UnAssignRoles>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'UnAssignRoles'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new UnAssignRolesResponse(); }
}

// @DataContract
export class GetAnalyticsInfo implements IReturn<GetAnalyticsInfoResponse>, IGet
{
    // @DataMember(Order=1)
    public month?: string;

    // @DataMember(Order=2)
    public type: string;

    // @DataMember(Order=3)
    public op: string;

    // @DataMember(Order=4)
    public apiKey: string;

    // @DataMember(Order=5)
    public userId: string;

    // @DataMember(Order=6)
    public ip: string;

    public constructor(init?: Partial<GetAnalyticsInfo>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'GetAnalyticsInfo'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new GetAnalyticsInfoResponse(); }
}

// @DataContract
export class GetAnalyticsReports implements IReturn<GetAnalyticsReportsResponse>, IGet
{
    // @DataMember(Order=1)
    public month?: string;

    // @DataMember(Order=2)
    public filter: string;

    // @DataMember(Order=3)
    public value: string;

    // @DataMember(Order=4)
    public force?: boolean;

    public constructor(init?: Partial<GetAnalyticsReports>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'GetAnalyticsReports'; }
    public getMethod() { return 'GET'; }
    public createResponse() { return new GetAnalyticsReportsResponse(); }
}

// @Route("/access-token")
// @DataContract
export class GetAccessToken implements IReturn<GetAccessTokenResponse>, IPost
{
    // @DataMember(Order=1)
    public refreshToken: string;

    // @DataMember(Order=2)
    public meta: { [index:string]: string; };

    public constructor(init?: Partial<GetAccessToken>) { (Object as any).assign(this, init); }
    public getTypeName() { return 'GetAccessToken'; }
    public getMethod() { return 'POST'; }
    public createResponse() { return new GetAccessTokenResponse(); }
}

