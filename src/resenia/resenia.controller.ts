import { Body, Controller, Param, Post, UseInterceptors } from '@nestjs/common';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors/business-errors.interceptor';
import { ReseniaService } from './resenia.service';
import { ReseniaDto } from './resenia.dto/resenia.dto';

@Controller('resenias')
@UseInterceptors(BusinessErrorsInterceptor)
export class ReseniaController {
  constructor(private readonly reseniaService: ReseniaService) {}
  @Post(':actividadId/estudiante/:estudianteId')
  async agregarResenia(
    @Param('actividadId') actividadId: string,
    @Param('estudianteId') estudianteId: string,
    @Body() reseniaDto: ReseniaDto,
  ) {
    return await this.reseniaService.agregarResenia(
      parseInt(actividadId),
      parseInt(estudianteId),
      reseniaDto
    );
  }
}
