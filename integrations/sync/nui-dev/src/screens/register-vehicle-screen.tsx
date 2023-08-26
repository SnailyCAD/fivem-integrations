import {
  Button,
  Loader,
  Alert,
  TextField,
  SelectField,
  AsyncListSearchField,
  Item,
} from "@snailycad/ui";
import { useVisibility } from "../components/visibility-provider";
import { useMutation, useQuery } from "@tanstack/react-query";
import { GetValuesData, PostCitizenVehicleData } from "@snailycad/types/api";
import { handleClientCadRequest } from "../fetch.client";
import { NuiMessage } from "../hooks/use-nui-event";
import { Citizen, Value, ValueType, VehicleValue } from "@snailycad/types";
import parseColor from "parse-color";
import { Formik, Form } from "formik";

const useVehicleValues = (actionData: NuiMessage["data"]) => {
  const { data } = useQuery({
    enabled: !!actionData?.url,
    queryKey: ["get-values"],
    queryFn: async () => {
      if (!actionData?.url || !actionData.userApiToken) {
        throw new Error("SnailyCAD API URL and/or Personal API Token not provided.");
      }

      const { data, error } = await handleClientCadRequest<GetValuesData>({
        method: "GET",
        path: "/admin/values/license?paths=vehicle",
        url: actionData.url,
        headers: { userApiToken: actionData.userApiToken },
      });

      if (error || !data) {
        console.log(error);

        return { licenseValues: [], vehicleValues: [] };
      }

      const licenseValues = (data.find((v) => v.type === ValueType.LICENSE)?.values ??
        []) as Value[];
      const vehicleValues = (data.find((v) => v.type === ValueType.VEHICLE)?.values ??
        []) as VehicleValue[];

      return {
        licenseValues,
        vehicleValues,
      };
    },
  });

  return data;
};

export function RegisterVehicleScreen() {
  const { hide, data: actionData } = useVisibility<{
    plate: string;
    color: [number, number, number];
    vehicleModelName: string;
  }>();
  const cadValues = useVehicleValues(actionData);

  const mutation = useMutation<PostCitizenVehicleData, Error, { statusId: string }>({
    mutationKey: ["register-vehicle"],
    onSuccess() {
      hide();

      // todo: notification
    },
    mutationFn: async () => {
      if (!actionData?.url || !actionData.userApiToken) {
        throw new Error("SnailyCAD API URL and/or Personal API Token not provided.");
      }

      const { data, error, errorMessage } = await handleClientCadRequest<PostCitizenVehicleData>({
        path: "/vehicles",
        method: "POST",
        url: actionData.url,
        // todo: data
        data: {},
        headers: { userApiToken: actionData.userApiToken },
      });

      if (error || !data) {
        throw new Error(
          error?.message ||
            errorMessage ||
            "Unknown error occurred. Please see F8 console for further details.",
        );
      }

      return data;
    },
  });

  function onSubmit(data: typeof INITIAL_VALUES) {
    // todo:
    data;
  }

  if (!actionData || !actionData.userApiToken) return null;
  const colorNameFromRGB = parseColor(`rgb(${actionData.color.join(",")})`);

  const INITIAL_VALUES = {
    citizenId: "",
    citizenName: "",
    plate: actionData.plate.toUpperCase(),
    color: colorNameFromRGB.keyword,
    modelName: "",
    model: null as string | null,
    registrationStatus: null as string | null,
  };

  return (
    <div className="w-[30rem] rounded-md bg-primary p-8">
      <header className="mb-2 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Register Vehicle</h1>

        <Button className="px-1 text-base" onPress={hide}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-x"
            viewBox="0 0 16 16"
          >
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
          </svg>
        </Button>
      </header>

      {mutation.error ? (
        <Alert type="error" title="An error occurred" message={mutation.error.message} />
      ) : null}

      <Formik onSubmit={onSubmit} initialValues={INITIAL_VALUES}>
        {({ values, errors, setValues, setFieldValue }) => (
          <Form className="mt-3">
            <AsyncListSearchField<Citizen>
              autoFocus
              className="w-full"
              setValues={({ localValue, node }) => {
                const labelValue =
                  typeof localValue !== "undefined" ? { citizenName: localValue } : {};
                const valueField = node?.value ? { citizenId: node.key as string } : {};

                setValues({ ...values, ...labelValue, ...valueField });
              }}
              localValue={values.citizenName}
              errorMessage={errors.citizenId as string}
              label="Owner"
              selectedKey={values.citizenId}
              fetchOptions={{
                userApiToken: actionData.userApiToken!,
                url: actionData.url,
                apiPath: `/search/name?fromAuthUserOnly=true`,
                method: "POST",
                bodyKey: "name",
                filterTextRequired: true,
              }}
            >
              {(item) => {
                const name = `${item.name} ${item.surname}`;

                return (
                  <Item key={item.id} textValue={name}>
                    <div className="flex items-center">
                      {/* {item.imageId ? (
                        <ImageWrapper
                          quality={70}
                          alt={`${item.name} ${item.surname}`}
                          className="rounded-md w-[30px] h-[30px] object-cover mr-2"
                          draggable={false}
                          src={makeImageUrl("citizens", item.imageId)!}
                          loading="lazy"
                          width={30}
                          height={30}
                          fallback={
                            <PersonFill className="w-6 h-6 mr-2 inline-block text-gray-500/60" />
                          }
                        />
                      ) : null} */}
                      <p>
                        {name} (SSN: {item.socialSecurityNumber})
                      </p>
                    </div>
                  </Item>
                );
              }}
            </AsyncListSearchField>

            <TextField isReadOnly label="Plate" defaultValue={actionData.plate.toUpperCase()} />
            <TextField
              onChange={(value) => setFieldValue("vinNumber", value)}
              label="VIN Number"
              isOptional
            />
            <TextField
              onChange={(value) => setFieldValue("color", value)}
              label="Color"
              defaultValue={colorNameFromRGB.keyword}
            />

            <AsyncListSearchField<VehicleValue>
              localValue={values.modelName}
              setValues={({ localValue, node }) => {
                const modelName =
                  typeof localValue !== "undefined" ? { modelName: localValue } : {};
                const model = node ? { model: node.key as string, modelValue: node.value } : {};

                setValues({ ...values, ...modelName, ...model });
              }}
              errorMessage={errors.model}
              label="Model"
              selectedKey={values.model}
              fetchOptions={{
                url: actionData.url,
                userApiToken: actionData.userApiToken!,
                apiPath: (value) => `/admin/values/vehicle/search?query=${value}`,
                method: "GET",
              }}
            >
              {(item) => {
                return <Item textValue={item.value.value}>{item.value.value}</Item>;
              }}
            </AsyncListSearchField>

            <SelectField
              onSelectionChange={(key) => setFieldValue("registrationStatus", key)}
              selectedKey={values.registrationStatus}
              label="Registration Status"
              options={(cadValues?.licenseValues ?? []).map((value) => ({
                label: value.value,
                value: value.id,
              }))}
            />

            <Button
              className="flex gap-2 items-center"
              type="submit"
              isDisabled={mutation.isLoading}
            >
              {mutation.isLoading ? <Loader /> : null}
              Register Vehicle
            </Button>
          </Form>
        )}
      </Formik>
    </div>
  );
}
