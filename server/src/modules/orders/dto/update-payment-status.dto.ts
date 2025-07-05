import { IsEnum } from 'class-validator';
import { PaymentStatus } from 'src/common/enums/payment-status.enum';

export class UpdatePaymentStatusDto {
    @IsEnum(PaymentStatus)
    paymentStatus: PaymentStatus;
}