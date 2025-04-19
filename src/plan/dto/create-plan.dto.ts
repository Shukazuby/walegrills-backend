import { ApiProperty } from '@nestjs/swagger';

export class CreatePlanDto {
  @ApiProperty({ example: '10 Meal Plan' })
  name: string;

  @ApiProperty({ example: 85 })
  amount: number;

  @ApiProperty({
    example:
      'This is a ten meal plan that enable users select 10 varieties of african delicacies',
  })
  description?: string;
}
