import {
  Card,
  CardBody,
  Typography,
  Button,
} from "@material-tailwind/react";
import Image from "next/image";

interface AboutCardProp {
  title: string;
  subTitle: string;
  description: string;
  image?: string;
}

export function AboutCard({ title, description, subTitle, image }: AboutCardProp) {
  return (
    <Card shadow={false}>
      <CardBody className="h-[453px] p-5 flex flex-col justify-center items-center rounded-2xl bg-gray-900 relative overflow-hidden">
        {image && (
          <div className="absolute inset-0">
            <Image
              src={image}
              alt={title}
              fill
              className="object-cover opacity-50"
            />
          </div>
        )}
        <div className="relative z-10">
          <Typography variant="h6" className="mb-4 text-center" color="white">
            {subTitle}
          </Typography>
          <Typography variant="h4" className="text-center" color="white">
            {title}
          </Typography>
          <Typography
            color="white"
            className="mt-2 mb-10 text-base w-full lg:w-8/12 text-center font-normal"
          >
            {description}
          </Typography>
          <Button color="white" size="sm">
            view details
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}

export default AboutCard;
