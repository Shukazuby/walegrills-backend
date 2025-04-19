import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus } from '@nestjs/common';
import { PlanService } from './plan.service';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BaseResponseTypeDTO } from 'src/utils';

@ApiTags('Plan')
@Controller('plan')
export class PlanController {
  constructor(private readonly planService: PlanService) {}

  @Post()
  @ApiOperation({ summary: 'Create a Plan' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Plan created',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async createPlan(
    @Body() payload: CreatePlanDto,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.planService.createPlan(
      payload
    );
    return result;
  }

  @Get()
  @ApiOperation({ summary: 'Find all plans' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Get all plans' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input' })
  async getPlans(
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.planService.getPlans();
    return result;
  }


  @Get(':id')
  @ApiOperation({ summary: 'Get a Plan by  Id' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Plan fetched',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async getAPlan(
    @Param('id') id: string,       
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.planService.getAPlan(id);
    return result;
  }
  

  @Patch(':id')
  @ApiOperation({ summary: 'Update a Plan' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Plan update their account',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async updatePlan(
    @Param('id') id: string,
    @Body() payload: UpdatePlanDto,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.planService.updatePlan(id, payload);
    return result;
  }

  @Delete(':id')
  @ApiOperation({ summary: 'delete Plan with a user' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Plan deleted',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data',
  })
  async deletePlan(
    @Param('id') id: string,
  ): Promise<BaseResponseTypeDTO> {
    const result = await this.planService.deletePlan(id);
    return result;
  }
}
