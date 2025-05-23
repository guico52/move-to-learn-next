import type {Executor} from './';
import {
    AuthController, 
    ChapterController, 
    ContractAdminAuthController, 
    CourseController, 
    MoveController, 
    ProgressController
} from './services/';

export class Api {
    
    readonly authController: AuthController
    
    readonly chapterController: ChapterController
    
    readonly contractAdminAuthController: ContractAdminAuthController
    
    readonly courseController: CourseController
    
    readonly moveController: MoveController
    
    readonly progressController: ProgressController
    
    constructor(executor: Executor) {
        this.authController = new AuthController(executor);
        this.chapterController = new ChapterController(executor);
        this.contractAdminAuthController = new ContractAdminAuthController(executor);
        this.courseController = new CourseController(executor);
        this.moveController = new MoveController(executor);
        this.progressController = new ProgressController(executor);
    }
}