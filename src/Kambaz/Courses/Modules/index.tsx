import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import * as coursesClient from "../client";
import * as modulesClient from "./client";
import {
  setModules,
  addModule,
  deleteModule,
  updateModule,
  editModule,
} from "./reducer";
import ModuleControlButtons from "./ModuleControlButtons";
import ModuleControls from "./ModulesControls";

interface Module {
  _id: string;
  name: string;
  course: string;
  editing?: boolean;
}

export default function Modules() {
  const { cid } = useParams<{ cid: string }>();
  const modules = useSelector(
    (state: any) => state.modulesReducer.modules
  ) as Module[];
  const dispatch = useDispatch();
  const [moduleName, setModuleName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchModules = async () => {
    if (!cid) return;
    try {
      setIsLoading(true);
      const modules = await coursesClient.findModulesForCourse(cid);
      dispatch(setModules(modules));
    } catch (err) {
      setError("Failed to fetch modules");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const saveModule = async (module: Module) => {
    try {
      setIsLoading(true);
      const updatedModule = await modulesClient.updateModule(module);
      dispatch(updateModule(updatedModule));
    } catch (err) {
      setError("Failed to save module");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const removeModule = async (moduleId: string) => {
    if (!window.confirm("Are you sure you want to delete this module?")) return;
    try {
      setIsLoading(true);
      await modulesClient.deleteModule(moduleId);
      dispatch(deleteModule(moduleId));
    } catch (err) {
      setError("Failed to delete module");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const createModuleForCourse = async () => {
    if (!cid || !moduleName.trim()) return;
    try {
      setIsLoading(true);
      const newModule = { name: moduleName.trim(), course: cid };
      const module = await coursesClient.createModuleForCourse(cid, newModule);
      dispatch(addModule(module));
      setModuleName("");
    } catch (err) {
      setError("Failed to create module");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchModules();
  }, [cid]);

  const editModuleHandler = (moduleId: string) => {
    dispatch(editModule(moduleId));
  };

  const handleUpdateModule = (module: Module) => {
    dispatch(updateModule(module));
  };

  const handleCancelEdit = (module: Module) => {
    dispatch(updateModule({ ...module, editing: false }));
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div className="alert alert-danger">{error}</div>;

  return (
    <div className="wd-modules">
      <ModuleControls
        setModuleName={setModuleName}
        moduleName={moduleName}
        addModule={createModuleForCourse}
      />

      <ul className="list-group rounded-0">
        {modules.map((module) => (
          <li key={module._id} className="list-group-item">
            {module.editing ? (
              <div className="d-flex align-items-center">
                <input
                  className="form-control me-2"
                  value={module.name}
                  onChange={(e) =>
                    handleUpdateModule({ ...module, name: e.target.value })
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      saveModule({ ...module, editing: false });
                    }
                  }}
                />
                <button
                  className="btn btn-sm btn-outline-secondary me-2"
                  onClick={() => saveModule({ ...module, editing: false })}
                >
                  Save
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handleCancelEdit(module)}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="d-flex justify-content-between align-items-center">
                <span>{module.name}</span>
                <ModuleControlButtons
                  moduleId={module._id}
                  deleteModule={removeModule}
                  editModule={editModuleHandler}
                />
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
